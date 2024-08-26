from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.db import connection
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date,timedelta
from corporate.models import CorporateDetail, CorporateUser
from ..models import PredictionLog, UserWebsiteInteraction
from ..utils.analyze import Analyze

TOKEN_EXTENSION_VALIDATOR = reverse('stats-list')

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

def create_prediction(user):
    data = {
        "url": "https://www.youtube.com/",
        "favicon": 1,
        "has_title": 1,
        "title": "YouTube",
        "has_copyright_info": 1,
        "has_social_media_links": 0,
        "has_description": 1,
        "has_external_form_submit": 0,
        "has_hidden_field": 0,
        "no_of_js": 0,
        "no_of_self_ref": 191
    }
    analyze = Analyze(data)
    data = analyze.result()
    prediction = PredictionLog.objects.create(**data)
    UserWebsiteInteraction.objects.create(user=user,website_log=prediction)

def create_corporate(user,**params):
    """Create a company detail."""
    detail = CorporateDetail.objects.create(**params)
    CorporateUser.objects.create(user=user,role='admin',corporate_details=detail)
    return detail

class PrivateStats(TestCase):

    def setUp(self) -> None:
        self.client = APIClient()
        with connection.cursor() as cursor:
            cursor.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm;")
        return super().setUp()
    
    def get_authenticated_user(self,user):
        self.client.force_authenticate(user=user)
    
    def test_get_prediction_stats(self):
        """get stats for a personal account."""
        user = get_user('personal','user@example.com')
        self.get_authenticated_user(user=user)
        create_prediction(user=user)
        res = self.client.get(TOKEN_EXTENSION_VALIDATOR)
        self.assertEqual(res.status_code,status.HTTP_200_OK)
        self.assertEqual(res.json()['results'],[{'legit': 1, 'total': 1}])

    def test_get_prediction_stats_admin_no_corporate_detail(self):
        """get stats for a corporate account without registered corporate details."""
        user = get_user('corporate','user@example.com')
        self.get_authenticated_user(user=user)
        create_prediction(user=user)
        res = self.client.get(TOKEN_EXTENSION_VALIDATOR+"?admin=true")
        self.assertEqual(res.status_code,status.HTTP_403_FORBIDDEN)
        self.assertEqual(res.json(),{'detail': 'User is not admin.'})

    def test_get_prediction_stats_admin_personal_account(self):
        """get stats for in corporate mode with personal account."""
        user = get_user('personal','user@example.com')
        self.get_authenticated_user(user=user)
        create_prediction(user=user)
        res = self.client.get(TOKEN_EXTENSION_VALIDATOR+"?admin=true")
        self.assertEqual(res.status_code,status.HTTP_403_FORBIDDEN)
        self.assertEqual(res.json(),{'detail': 'User type is not corporate.'})

    def test_get_prediction_stats_admin_corporate_not_activated(self):
        """get stats for a corporate account with corporate not activated."""
        user = get_user('corporate','user@example.com')
        self.get_authenticated_user(user=user)
        create_prediction(user=user)
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543",
            "activated":False
        }
        create_corporate(user=user,**params)
        res = self.client.get(TOKEN_EXTENSION_VALIDATOR+"?admin=true")
        self.assertEqual(res.status_code,status.HTTP_403_FORBIDDEN)
        self.assertEqual(res.json(),{'detail': 'Corporate Not Activated.'})

    
    def test_get_prediction_stats_admin_corporate_subscription_expired(self):
        """get stats for a corporate account with subscription expired."""
        user = get_user('corporate','user@example.com')
        self.get_authenticated_user(user=user)
        create_prediction(user=user)
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543",
            "activated":True,
            "subscribed":True,
            "subscription_expires_at":date.today()-timedelta(days=30)
        }
        create_corporate(user=user,**params)
        res = self.client.get(TOKEN_EXTENSION_VALIDATOR+"?admin=true")
        self.assertEqual(res.status_code,status.HTTP_403_FORBIDDEN)
        self.assertEqual(res.json(),{'detail': 'Corporate Subscription Expired.'})

    def test_get_prediction_stats_admin_success(self):
        """get stats for a corporate account with registered corporate details."""
        user = get_user('corporate','user@example.com')
        self.get_authenticated_user(user=user)
        create_prediction(user=user)
        params = {
            "company_name":"xyz",
            "contact_email":"abc@example.com",
            "contact_phone":"1226543",
            "activated":True,
            "subscribed":True,
            "subscription_expires_at":date.today()+timedelta(days=30)
        }
        create_corporate(user=user,**params)
        res = self.client.get(TOKEN_EXTENSION_VALIDATOR+"?admin=true")
        self.assertEqual(res.status_code,status.HTTP_200_OK)
        self.assertEqual(res.json()['results'],[{'user': {'first_name': 'John', 'last_name': 'Doe', 'email': 'user@example.com'}, 'legit': 1, 'total': 1}])
