from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.db import connection
from rest_framework.test import APIClient
from rest_framework import status
from unittest import mock

CREATE_PREDICTION = reverse('predict-list')

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

class PrivatePredictionLogTests(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        user = get_user(account_type='personal',email='test@example.com')
        self.client.force_authenticate(user)
        with connection.cursor() as cursor:
            cursor.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm;")
        return super().setUp()
    
    @mock.patch('prediction.utils.analyze.get_predictions')
    def testPerformPredictionSuccessful(self,get_predictions):
        """Returns 200 OK for successful prediction."""
        get_predictions.return_value = {"svc_pca":1,"xgboost_pca":0}
        data = {
            "url": "https://www.youtube.com/",
            "favicon": 1,
            "has_title": 1,
            "title": "YouTube",
            "has_copyright_info": 1,
            "has_social_media_links": 0,
            "has_description": 1,
            "has_external_form_submit": 0,
            "iframe": 2,
            "has_hidden_field": 0,
            "has_password_field": 0,
            "no_of_images": 79,
            "no_of_css": 6,
            "no_of_js": 0,
            "no_of_self_ref": 191
        }

        res = self.client.post(CREATE_PREDICTION,data=data)
        self.assertEqual(res.status_code,status.HTTP_201_CREATED)
        self.assertDictEqual(res.json(),{"svc_pca":1,"xgboost_pca":0})

    def testPerformPredictionIncompleteData(self):
        """Returns 400 Bad Request if data is incomplete in payload"""
        data = {
            "url": "https://www.youtube.com/",
            "favicon": 1,
            "has_title": 1,
            "title": "YouTube",
            "has_copyright_info": 1,
            "has_social_media_links": 0,
            "has_description": 1,
            "has_external_form_submit": 0,
            "iframe": 2,
            "has_hidden_field": 0,
            "has_password_field": 0,
            "no_of_images": 79,
            "no_of_css": 6,
            "no_of_js": 0
        }

        res = self.client.post(CREATE_PREDICTION,data=data)
        self.assertEqual(res.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertDictEqual(res.json(),{'no_of_self_ref': ['This field is required.']})
