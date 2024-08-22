from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.exceptions import APIException
from corporate.models import CorporateDetail,CorporateUser
from payment.models import Subscription
from unittest import mock
from stripe._error import InvalidRequestError,APIConnectionError
import stripe

CREATE_CHECKOUT_SESSION = reverse('payment:payment-create-checkout-session')
GET_SESSION_STATUS = reverse('payment:payment-session-status')
STRIPE_HOOK = reverse('payment:payment-stripe-hook')

def get_user(account_type,email):
    params = {
        "email":email,
        "password":"User@1234",
        "is_active":True,
        "account_type":account_type,
        "first_name":"John",
        "last_name":"Doe",
        "phone":"9829487",
    }
    return get_user_model().objects.create(**params)

def create_corporate(user,**params):
    """Create a company detail."""
    detail = CorporateDetail.objects.create(**params)
    CorporateUser.objects.create(user=user,role='admin',corporate_details=detail)
    return detail

class PrivatePaymentApiTest(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        return super().setUp()
    
    def get_authenticated_user(self,account_type,email):
        user = get_user(account_type=account_type,email=email)
        self.client.force_authenticate(user)
        return user
    
    def test_create_checkout_session_without_corporate(self):
        """Return 403 if user's account type is not corporate."""
        self.get_authenticated_user(account_type='personal',email="user@email.com")
        res = self.client.post(CREATE_CHECKOUT_SESSION)
        self.assertEqual(res.status_code,status.HTTP_403_FORBIDDEN)
        self.assertDictEqual(res.json(),{'detail': 'User is not corporate type'})

    def test_create_checkout_session_without_admin_role(self):
        """Return 403 if user doesnot have admin role."""
        user = self.get_authenticated_user(account_type='corporate',email="user@email.com")
        res = self.client.post(CREATE_CHECKOUT_SESSION)
        self.assertEqual(res.status_code,status.HTTP_403_FORBIDDEN)
        self.assertDictEqual(res.json(),{'detail': 'Corporate Not activated or user is not admin.'})

    @mock.patch('stripe.checkout.Session.create')
    def test_create_checkout_session_with_admin_role(self,create):
        """Returns 200 and creates checkout session id."""
        create.return_value = {"id":1,"client_secret":"cs_test_a1UcH0wuyz2DyVu"}
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543",
            "activated":True
        }
        user = self.get_authenticated_user(account_type='corporate',email="user@email.com")
        create_corporate(user,**params)
        res = self.client.post(CREATE_CHECKOUT_SESSION)
        self.assertEqual(res.status_code,status.HTTP_200_OK)
        self.assertDictEqual(res.json(),{'clientSecret': 'cs_test_a1UcH0wuyz2DyVu'})

    def test_create_checkout_session_with_admin_role_for_activated_account(self):
        """Returns 200 with already activated message."""
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543",
            "subscribed":True,
            "activated":True
        }
        user = self.get_authenticated_user(account_type='corporate',email="user@email.com")
        create_corporate(user,**params)
        res = self.client.post(CREATE_CHECKOUT_SESSION)
        self.assertEqual(res.status_code,status.HTTP_200_OK)
        self.assertDictEqual(res.json(),{"status":"Corporate Account already activated"})

    @mock.patch('stripe.checkout.Session.create')
    def test_create_checkout_session_with_admin_role_with_api_exception(self,create):
        """Returns 500 with api error."""
        create.side_effect = [APIException(detail={"error":"Unkown"},code=status.HTTP_500_INTERNAL_SERVER_ERROR)]
        create.return_value = {"id":1,"client_secret":"cs_test_a1UcH0wuyz2DyVu"}
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543",
            "activated":True
        }
        user = self.get_authenticated_user(account_type='corporate',email="user@email.com")
        create_corporate(user,**params)
        res = self.client.post(CREATE_CHECKOUT_SESSION)
        self.assertEqual(res.status_code,status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertDictEqual(res.json(),{'detail': "{'error': ErrorDetail(string='Unkown', code=500)}"})

class PublicPaymentApiTest(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        return super().setUp()
    
    @mock.patch('stripe.checkout.Session.retrieve')
    def test_check_session_invalid_session_id(self,retrieve_session):
        """return 400 with session id not found message."""
        retrieve_session.side_effect = InvalidRequestError(message="Not Found.",
                                                            param="Not Found.")
        res = self.client.get(GET_SESSION_STATUS)
        self.assertEqual(res.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertDictEqual(res.json(),{'error': "Session ID '' doesn't exist."})

    @mock.patch('stripe.checkout.Session.retrieve')
    def test_check_session_api_error(self,retrieve_session):
        """return 500 with service unavailable message."""
        retrieve_session.side_effect = APIConnectionError(message="Service unavailable.")
        res = self.client.get(GET_SESSION_STATUS)
        self.assertEqual(res.status_code,status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertDictEqual(res.json(),{'error': 'Service unavailable'})

    @mock.patch('stripe.checkout.Session.retrieve')
    def test_check_session_success(self,retrieve_session):
        retrieve_session.return_value = {"subscription":"test","status":"completed","customer_details":{"email":"user@email.com"}}
        user = get_user('corporate','user@example.com')
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543"
        }
        corporate = create_corporate(user,**params)
        Subscription.objects.create(session_id="123",corporate=corporate)
        res = self.client.get(GET_SESSION_STATUS+f"?session_id=123")
        self.assertEqual(res.status_code,status.HTTP_200_OK)
        self.assertDictEqual(res.json(),{'status': 'completed', 'customer_email': 'user@email.com'})

    def test_stripe_hook_missing_signature(self):
        """Return 400 if no signature provided."""
        payload = {}
        res = self.client.post(STRIPE_HOOK,data=payload)
        self.assertEqual(res.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertDictEqual(res.json(),{"error":"Invalid Signature."})

    @mock.patch('stripe.Webhook.construct_event')
    def test_stripe_hook_empty_payload(self,construct_event):
        """Return 400 if payload is not valid."""
        construct_event.side_effect = [ValueError()]
        payload = {}
        headers = {"HTTP_STRIPE_SIGNATURE":"test_sig"}
        res = self.client.post(STRIPE_HOOK,data=payload,**headers)
        self.assertEqual(res.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertDictEqual(res.json(),{"error":"Invalid Payload."})

    @mock.patch('stripe.Webhook.construct_event')
    def test_stripe_hook_invalid_signature(self,construct_event):
        """Return 400 if signature is not valid."""
        construct_event.side_effect = [stripe.error.SignatureVerificationError(message="Invalid Signature",sig_header="test_sig")]
        payload = {}
        headers = {"HTTP_STRIPE_SIGNATURE":"test_sig"}
        res = self.client.post(STRIPE_HOOK,data=payload,**headers)
        self.assertEqual(res.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertDictEqual(res.json(),{"error":"Invalid STRIPE_WEBHOOK_SECRET."})

    @mock.patch('stripe.Webhook.construct_event')
    def test_stripe_hook_subscription_created(self,construct_event):
        """Returns 200 with subscription started for 30 days"""
        user = get_user('corporate','user@example.com')
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543"
        }
        corporate_detail = create_corporate(user=user,**params)
        sub = Subscription.objects.create(session_id="123",subscription_id="123_id",corporate=corporate_detail)

        construct_event.return_value = {
            "data":{
                "object":{
                    "id":sub.subscription_id
                }
            },
            "type":"customer.subscription.created"
        }

        payload = {}
        headers = {"HTTP_STRIPE_SIGNATURE":"test_sig"}
        self.client.post(STRIPE_HOOK,data=payload,**headers)
        sub.refresh_from_db()
        self.assertTrue(sub.corporate.subscribed)
        self.assertIsNotNone(sub.corporate.subscription_expires_at)

    @mock.patch('stripe.Webhook.construct_event')
    def test_stripe_hook_subscription_deleted(self,construct_event):
        """Returns 200 with subscription deleted with immediate effect."""
        user = get_user('corporate','user@example.com')
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543",
            "subscribed":True
        }
        corporate_detail = create_corporate(user=user,**params)
        sub = Subscription.objects.create(session_id="123",subscription_id="123_id",corporate=corporate_detail)

        construct_event.return_value = {
            "data":{
                "object":{
                    "id":sub.subscription_id
                }
            },
            "type":"customer.subscription.deleted"
        }

        payload = {}
        headers = {"HTTP_STRIPE_SIGNATURE":"test_sig"}
        self.client.post(STRIPE_HOOK,data=payload,**headers)
        sub.refresh_from_db()
        self.assertFalse(sub.corporate.subscribed)
        self.assertIsNone(sub.corporate.subscription_expires_at)

    @mock.patch('stripe.Webhook.construct_event')
    def test_stripe_hook_subscription_paused(self,construct_event):
        """Returns 200 with subscription paused with immediate effect."""
        user = get_user('corporate','user@example.com')
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543",
            "subscribed":True
        }
        corporate_detail = create_corporate(user=user,**params)
        sub = Subscription.objects.create(session_id="123",subscription_id="123_id",corporate=corporate_detail)

        construct_event.return_value = {
            "data":{
                "object":{
                    "id":sub.subscription_id
                }
            },
            "type":"customer.subscription.paused"
        }

        payload = {}
        headers = {"HTTP_STRIPE_SIGNATURE":"test_sig"}
        self.client.post(STRIPE_HOOK,data=payload,**headers)
        sub.refresh_from_db()
        self.assertFalse(sub.corporate.subscribed)
        self.assertIsNone(sub.corporate.subscription_expires_at)

    @mock.patch('stripe.Webhook.construct_event')
    def test_stripe_hook_subscription_updated(self,construct_event):
        """Returns 200 with subscription updated for 30 days"""
        user = get_user('corporate','user@example.com')
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543"
        }
        corporate_detail = create_corporate(user=user,**params)
        sub = Subscription.objects.create(session_id="123",subscription_id="123_id",corporate=corporate_detail)

        construct_event.return_value = {
            "data":{
                "object":{
                    "id":sub.subscription_id
                }
            },
            "type":"customer.subscription.updated"
        }

        payload = {}
        headers = {"HTTP_STRIPE_SIGNATURE":"test_sig"}
        self.client.post(STRIPE_HOOK,data=payload,**headers)
        sub.refresh_from_db()
        self.assertTrue(sub.corporate.subscribed)
        self.assertIsNotNone(sub.corporate.subscription_expires_at)

    @mock.patch('stripe.Webhook.construct_event')
    def test_stripe_hook_subscription_invalid_type(self,construct_event):
        """Returns 400 with invalid event message"""
        user = get_user('corporate','user@example.com')
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543"
        }
        corporate_detail = create_corporate(user=user,**params)
        sub = Subscription.objects.create(session_id="123",subscription_id="123_id",corporate=corporate_detail)

        construct_event.return_value = {
            "data":{
                "object":{
                    "id":sub.subscription_id
                }
            },
            "type":"customer.subscription.invalid"
        }

        payload = {}
        headers = {"HTTP_STRIPE_SIGNATURE":"test_sig"}
        self.client.post(STRIPE_HOOK,data=payload,**headers)
        sub.refresh_from_db()
        self.assertFalse(sub.corporate.subscribed)
        self.assertIsNone(sub.corporate.subscription_expires_at)