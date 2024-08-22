from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from unittest import mock

TOKEN_EXTENSION_VALIDATOR = reverse('token-extension-validator')

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

class PublicExtensionTokenValidatorTest(TestCase):

    def setUp(self) -> None:
        self.client = APIClient()
        return super().setUp()
    
    def test_get_extension_token_validator_invalid_token(self):
        """Response 400 with user not found."""
        data = {
            "token":"invalid-token"
        }
        res = self.client.post(TOKEN_EXTENSION_VALIDATOR,data=data)
        self.assertEqual(res.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertEqual(res.json(),{'error': 'Invalid token'})

    def test_get_extension_token_validator_token_not_found(self):
        """Send request with token. Response 400"""
        data = {
        }
        res = self.client.post(TOKEN_EXTENSION_VALIDATOR,data=data)
        self.assertEqual(res.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertEqual(res.json(),{'error': 'No Token Found'})

    @mock.patch('prediction.views.views_extension_token_validator.random.choices')
    def test_get_extension_token_validator_success(self,choices):
        """Send request with valid token. Response 200 with validator."""
        choices.return_value = ['a']*10
        user = get_user('personal','test@example.com')
        data = {
            "token":user.extension_token
        }
        res = self.client.post(TOKEN_EXTENSION_VALIDATOR,data=data)
        self.assertEqual(res.status_code,status.HTTP_200_OK)
        self.assertEqual(res.json(),{"validator":"aaaaaaaaaa"})
