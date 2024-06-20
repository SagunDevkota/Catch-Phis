"""
URL mappings for user API.
"""

from django.urls import path
from user.views import views_user

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

app_name = 'user'

urlpatterns = [
    path('create/',views_user.CreateUserView.as_view(), name='create'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/',views_user.ManageUserView.as_view(), name='profile'),
    path('profile/activate/',views_user.ActivateAccountView.as_view(), name='activate-account'),
]