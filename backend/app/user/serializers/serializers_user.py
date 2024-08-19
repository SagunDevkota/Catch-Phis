"""
Serializers for the user API View.
"""
from django.contrib.auth import (
        get_user_model,
        authenticate
    )
from django.utils.translation import gettext as _
from django.core.cache import cache

from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
import random
from config.settings.common_tasks import send_email

class PasswordValidator:
    def __init__(self, min_length=8):
        self.min_length = min_length

    def validate(self, password, user_email):
        errors = {"password":[]}
        if len(password) < self.min_length:
            errors["password"].append(f"The password must be at least {self.min_length} characters long.")

        if not any(char.isupper() for char in password):
            errors["password"].append("The password must contain at least one capital letter.")

        if not any(char in "!@#$%^&*()-_=+[]{}|;:'\",.<>/?`~" for char in password):
            errors["password"].append("The password must contain at least one special character.")

        if user_email.lower() in password.lower() or password.lower() in user_email.lower():
            errors['password'].append("The password must not contain the email address.")
        if(len(errors['password'])>0):
            raise serializers.ValidationError(errors)
        return password

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user object."""

    class Meta:
        model = get_user_model()
        fields = ['email','first_name','last_name','phone','password','account_type','parent_user','is_active']
        extra_kwargs = {'password': 
                        {'write_only':True}
                        }
        read_only_fields = ['parent_user','is_active']
        
    def validate(self, attrs):
        email = attrs.get('email', None)
        password = attrs.get('password', None)

        if email and password:
            password_validator = PasswordValidator()
            password = password_validator.validate(password, email)

        attrs['password'] = password
        return attrs
        
    def create(self,validated_data):
        """Create and return a user with encrypted password."""
        user = get_user_model().objects.create_user(**validated_data)
        while True:
            token = random.randint(111111,999999)
            if(cache.get(token)):
                continue
            cache.set(token,user.email,60*3)
            break
        send_email.delay("Catch Phis: Activate Account",f"Activate the account token: {token}",[user.email])
        return user
    
    def update(self,instance,validated_data):
        """Update and return user."""
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user
    
class UserSlimSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['first_name','last_name','email']
        read_only_fields = fields
    
class UserDetailsSerializer(serializers.ModelSerializer):
    """Serializer with all user details"""
    class Meta:
        model = get_user_model()
        fields = ["id","last_login","is_superuser","first_name","last_name","phone","email","is_active","is_staff","is_superuser",'account_type','parent_user','extension_token']
        extra_kwargs = {'password': 
                        {'write_only':True,'min_length':5}
                        }
        read_only_fields = ['extension_token']
    
class AuthTokenSerializer(serializers.Serializer):
    """Serializer for the user auth token"""
    email = serializers.EmailField()
    password = serializers.CharField(
        style={'input_type':"password"},
        trim_whitespace=False,
    )

    def validate(self,attrs):
        """Validate and authenticate the user."""
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password,
        )
        
        if not user:
            msg = _("Unable to authenticate with provided credentials.")
            raise serializers.ValidationError(msg, code="authorization")
        
        attrs['user'] = user
        
        return attrs
    
    def get_token(self, user):
        """Retrieve the access token and refresh token for the user."""
        refresh = RefreshToken.for_user(user)
        tokens = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }
        return tokens
    
class UserActivationSerialider(serializers.Serializer):
    """Serializer for user actiovation"""
    token = serializers.CharField()

    class Meta:
        model = get_user_model()
        fields = ['token']
