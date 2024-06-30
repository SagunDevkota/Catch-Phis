from django.test import TestCase
from django.urls import reverse
from django.core.cache import cache
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from unittest import mock
from corporate.models import CorporateDetail,CorporateUser

CORPORATE_CREATE_URL = reverse('corporate:detail-list')
CREATE_USER_URL = reverse('user:create')
CORPORATE_LIST_URL = reverse('corporate:detail-list')
CORPORATE_ACTIVATE_URL = reverse('corporate:detail-activate')
CREATE_CORPORATE_USER_URL = reverse('corporate:user-list')

def create_corporate(user,**params):
    """Create a company detail."""
    detail = CorporateDetail.objects.create(**params)
    CorporateUser.objects.create(user=user,role='admin',corporate_details=detail)
    return detail

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

class PrivateTestAPI(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
    
    def authenticate_user(self,account_type,email="user@example.com"):
        user = get_user(account_type=account_type,email=email)
        self.client.force_authenticate(user=user)
        return user

    def test_create_corporate_detail_with_personal_account(self):
        """Return error 403 if user is not corporate type."""
        self.authenticate_user(account_type="personal")
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543"
        }
        res = self.client.post(CORPORATE_CREATE_URL,params)
        self.assertEqual(res.status_code,status.HTTP_403_FORBIDDEN)
        self.assertDictEqual(res.json(),{"detail": "You do not have permission to perform this action."})

    @mock.patch('config.settings.common_tasks.send_email.delay')
    def test_create_corporate_detail_with_corporate_account(self,send_email):
        """Return 201 if user is corporate type."""
        self.authenticate_user(account_type="corporate")
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543",
            "account_type":"corporate"
        }
        send_email.side_effect = None
        res = self.client.post(CORPORATE_CREATE_URL,params)
        self.assertEqual(res.status_code,status.HTTP_201_CREATED)

    @mock.patch('config.settings.common_tasks.send_email.delay')
    def test_create_corporate_detail_with_duplicate_email(self,send_email):
        """Return 400 if the corporate account with same email exists."""
        self.authenticate_user(account_type="corporate")
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543",
            "account_type":"corporate"
        }
        send_email.side_effect = None
        res = self.client.post(CORPORATE_CREATE_URL,params)
        self.authenticate_user(account_type="corporate",email="test2@example.com")
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"12265433",
            "account_type":"corporate"
        }
        res = self.client.post(CORPORATE_CREATE_URL,params)
        self.assertDictEqual(res.json(),{'contact_email': ['corporate detail with this contact email already exists.']})
        self.assertEqual(res.status_code,status.HTTP_400_BAD_REQUEST)
    
    @mock.patch('config.settings.common_tasks.send_email.delay')
    def test_create_corporate_detail_with_different_case_email(self,send_email):
        """Return 400 if the corporate account with same email but different case exists."""
        self.authenticate_user(account_type="corporate")
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543",
            "account_type":"corporate"
        }
        send_email.side_effect = None
        res = self.client.post(CORPORATE_CREATE_URL,params)
        self.authenticate_user(account_type="corporate",email="test2@example.com")
        params = {
            "company_name":"xyz",
            "contact_email":"ABC@example.com",
            "contact_phone":"12265433",
            "account_type":"corporate"
        }
        res = self.client.post(CORPORATE_CREATE_URL,params)
        self.assertDictEqual(res.json(),{'contact_email': ['corporate detail with this contact email already exists.']})
        self.assertEqual(res.status_code,status.HTTP_400_BAD_REQUEST)

    @mock.patch('config.settings.common_tasks.send_email.delay')
    def test_create_corporate_detail_with_duplicate_phone(self,send_email):
        """Return 400 if the corporate account with same phone exists."""
        self.authenticate_user(account_type="corporate")
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543"
        }
        send_email.side_effect = None
        res = self.client.post(CORPORATE_CREATE_URL,params)
        self.authenticate_user(account_type="corporate",email="test2@example.com")
        params = {
            "company_name":"xyz",
            "contact_email":"abcd@example.com",
            "contact_phone":"1226543"
        }
        res = self.client.post(CORPORATE_CREATE_URL,params)
        self.assertDictEqual(res.json(),{'contact_phone': ['corporate detail with this contact phone already exists.']})
        self.assertEqual(res.status_code,status.HTTP_400_BAD_REQUEST)

    def test_get_corporate_details_with_corporate_account(self):
        """Return 200 with the detail of corporate user is associated with."""
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543"
        }
        user = self.authenticate_user('corporate')
        create_corporate(user,**params)
        res = self.client.get(CORPORATE_LIST_URL)
        self.assertEqual(res.status_code,status.HTTP_200_OK)
        self.assertEqual(res.json()[0]['company_name'],params['company_name'])

    def test_get_corporate_details_with_personal_account(self):
        """Return 403 with the detail of corporate user is associated with."""
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543"
        }
        user = self.authenticate_user('personal')
        create_corporate(user,**params)
        res = self.client.get(CORPORATE_LIST_URL)
        self.assertEqual(res.status_code,status.HTTP_403_FORBIDDEN)
        self.assertEqual(res.json(),{
            "detail": "You do not have permission to perform this action."
            })
    
    def test_activate_corporate_details_with_corporate_account(self):
        """Return 200 with corporate activated message."""
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543"
        }
        user = self.authenticate_user('corporate')
        create_corporate(user,**params)
        cache.set(111111,'abc@example.com')
        params = {"token":111111}
        res = self.client.post(CORPORATE_ACTIVATE_URL,data=params)
        self.assertEqual(res.status_code,status.HTTP_200_OK)
        self.assertEqual(res.json(),{'detail': 'Account activated for abc@example.com'})

    def test_create_corporate_user(self):
        """Return 201 and create a corporate user."""
        user = self.authenticate_user('corporate')
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543"
        }
        create_corporate(user=user,**params)
        params = {
            "first_name": "string",
            "last_name": "string",
            "phone": "string",
            "email": "user_emp@example.com",
            "password": "string",
            "role": "admin"
            }
        res = self.client.post(CREATE_CORPORATE_USER_URL,data=params)
        self.assertEqual(res.status_code,status.HTTP_201_CREATED)
        self.assertDictEqual(res.json(),{
            'first_name': 'string', 
            'last_name': 'string', 
            'phone': 'string', 
            'email': 'user_emp@example.com', 
            'password': 'string', 
            'role': 'admin'
            })

    def test_list_corporate_user_admin(self):
        """Return 200 and list users from a corporate."""
        user = self.authenticate_user('corporate')
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543"
        }
        create_corporate(user=user,**params)
        res = self.client.get(CREATE_CORPORATE_USER_URL)
        self.assertEqual(res.status_code,status.HTTP_200_OK)

    def test_list_corporate_user_employee(self):
        """Returns 403 with insufficient permission error."""
        user = self.authenticate_user('corporate')
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543"
        }
        create_corporate(user=user,**params)
        params = {
            "first_name": "string",
            "last_name": "string",
            "phone": "string",
            "email": "user_emp@example.com",
            "password": "string",
            "role": "employee"
            }
        self.client.post(CREATE_CORPORATE_USER_URL,data=params)
        user = get_user_model().objects.get(email='user_emp@example.com')
        self.client.force_authenticate(user=user)
        res = self.client.get(CORPORATE_CREATE_URL)
        self.assertEqual(res.status_code,status.HTTP_403_FORBIDDEN)
        self.assertDictEqual(res.json(),{'detail': 'You do not have permission to perform this action.'})

    def test_create_multiple_corporate_fail(self):
        """Returns error if single user tries to create multiple corporate."""
        user = self.authenticate_user('corporate')
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543"
        }
        create_corporate(user=user,**params)
        params = {
            "first_name": "string",
            "last_name": "string",
            "phone": "string",
            "email": "user_emp@example.com",
            "password": "string",
            "role": "employee"
            }
        res = self.client.post(CREATE_CORPORATE_USER_URL,data=params)
        params = {
            "first_name": "string",
            "last_name": "string",
            "phone": "string",
            "email": "user_emp@example.com",
            "password": "string",
            "role": "employee"
            }
        res = self.client.post(CREATE_CORPORATE_USER_URL,data=params)
        self.assertEqual(res.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertDictEqual(res.json(),{'error': 'Key (email)=(user_emp@example.com) already exists.'})