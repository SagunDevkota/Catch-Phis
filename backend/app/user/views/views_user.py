"""
Views for the user API
"""

from django.contrib.auth import get_user_model
from django.core.cache import cache

from rest_framework import generics, permissions, status
from rest_framework.response import Response

from rest_framework_simplejwt.authentication import JWTAuthentication

from user.serializers.serializers_user import (
    UserSerializer,
    UserDetailsSerializer,
    UserActivationSerialider
)

class CreateUserView(generics.CreateAPIView):
    """Create a new user in the system account_type : personal/corporate"""
    serializer_class = UserSerializer


class ManageUserView(generics.RetrieveUpdateAPIView):
    """Manage the authenticated user."""
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()

    def get_object(self):
        """Retrieve and return the authenticated user."""
        return self.request.user
    
    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'PUT']:
            return UserSerializer
        else:
            return UserDetailsSerializer
        
class ActivateAccountView(generics.CreateAPIView):
    """
    Activate the user account.
    """
    
    serializer_class = UserActivationSerialider

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=self.request.data)
        if(serializer.is_valid()):
            token = (serializer.validated_data["token"])
            user_email = cache.get(token)
            if not user_email:
                return Response({'error': 'Invalid or expired activation code'}, status=status.HTTP_404_NOT_FOUND)
            user = get_user_model().objects.filter(email=user_email).first()
            if user:
                user.is_active = True
                user.save()
            cache.delete(token)
            return Response({'message': 'Account activated'}, status=status.HTTP_200_OK)
        
        return Response({"error":"Token is required"},status=status.HTTP_400_BAD_REQUEST)
