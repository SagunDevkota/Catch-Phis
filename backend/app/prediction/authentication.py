from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError,MultipleObjectsReturned,ObjectDoesNotExist
from django.utils.translation import gettext_lazy as _
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions

class CustomUserAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.headers.get('token',None)
        validator = request.headers.get('validator',None)
        if(token and validator):
            try:
                user = get_user_model().objects.get(extension_token=token,extension_validator=validator)
            except (ValidationError,MultipleObjectsReturned,ObjectDoesNotExist):
                msg = _('Invalid Token or Validator')
                raise exceptions.AuthenticationFailed(msg)
            return (user,None)
        msg = _('Token and Validator not provided.')
        raise exceptions.AuthenticationFailed(msg)