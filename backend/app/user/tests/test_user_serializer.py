"""Unittest user serializer"""
from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework import serializers

from user.serializers.serializers_user import UserSerializer,AuthTokenSerializer

def create_user(**params):
    """Create and return a new user"""
    return get_user_model().objects.create_user(**params)

class UserSerializerTests(TestCase):
    """Test the validations for user serializer"""
    def setUp(self) -> None:
        self.client = APIClient()
        return super().setUp()
    
    def test_login_serializer_validation_success(self):
        """Test login success"""
        payload = {
            "first_name" : "xyz",
            "last_name" : "abc",
            "phone" : "1234",
            "email" : "user1@example.com",
            "password" : "test123"
        }

        user = create_user(**payload)
        user.is_active = True
        user.save()
        serializer = AuthTokenSerializer(data={"email":payload["email"],"password":payload["password"]})
        serializer.is_valid(raise_exception=True)
        self.assertIsNotNone(serializer.validated_data["user"])
    
    def test_get_token_serializer_success(self):
        """Test get token from serializer success"""
        payload = {
            "first_name" : "xyz",
            "last_name" : "abc",
            "phone" : "1234",
            "email" : "user1@example.com",
            "password" : "test123"
        }

        user = create_user(**payload)
        user.is_active = True
        user.save()
        serializer = AuthTokenSerializer(data={"email":payload["email"],"password":payload["password"]})
        serializer.is_valid(raise_exception=True)
        attrs = serializer.get_token(user)
        self.assertIn("access",attrs.keys())
        self.assertIn("refresh",attrs.keys())

    def test_login_serializer_validation_failed(self):
        """Test login failed"""
        payload = {
            "first_name" : "xyz",
            "last_name" : "abc",
            "phone" : "1234",
            "email" : "user1@example.com",
            "password" : "test123"
        }

        user = create_user(**payload)
        user.is_active = True
        user.save()
        serializer = AuthTokenSerializer(data={"email":payload["email"],"password":"pass"})
        with self.assertRaises(serializers.ValidationError) as context:
            serializer.is_valid(raise_exception=True)

    def test_password_validator_strong_password(self):
        """Throw error if the email and password is same."""
        payload = {
            "first_name" : "xyz",
            "last_name" : "abc",
            "phone" : "1234",
            "email" : "user@example.com",
            "password" : "User@pass123"
        }
        serializer = UserSerializer(data=payload)
        validated_data = serializer.validate({"email":payload["email"],"password":payload["password"]})
        self.assertEqual(validated_data["password"],payload["password"])

    def test_password_validator_weak_password(self):
        """Throw error if the email and password is same."""
        payload = {
            "first_name" : "xyz",
            "last_name" : "abc",
            "phone" : "1234",
            "email" : "user@example.com",
            "password" : "pass"
        }
        serializer = UserSerializer(data=payload)
        with self.assertRaises(serializers.ValidationError) as context:
            serializer.is_valid(raise_exception=True)

        payload = {
            "first_name" : "xyz",
            "last_name" : "abc",
            "phone" : "1234",
            "email" : "user@example.com",
            "password" : "user@example.com"
        }
        serializer = UserSerializer(data=payload)
        with self.assertRaises(serializers.ValidationError) as context:
            serializer.is_valid(raise_exception=True)