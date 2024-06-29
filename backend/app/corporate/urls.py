"""
URL mappings for user API.
"""

from django.urls import path,include
from rest_framework.routers import DefaultRouter
from corporate.views import views_corporate

router = DefaultRouter()
router.register('detail',views_corporate.CorporateDetailViewSet,basename='detail')
router.register('user',views_corporate.CorporateUserViewSet,basename='user')

app_name = 'corporate'

urlpatterns = [
    path('corporate/',include(router.urls)),
]