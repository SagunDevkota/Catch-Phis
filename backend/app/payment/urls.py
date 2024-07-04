"""
URL mappings for user API.
"""

from django.urls import path,include
from rest_framework.routers import DefaultRouter
from payment import views

router = DefaultRouter()
router.register('',views.CorporateCreateCheckoutAPIView,basename='payment')

app_name = 'payment'

urlpatterns = [
    path('',include(router.urls)),
    # path('corporate/session-status/',views.CorporateCheckoutStatus.as_view(),name='session-status'),
    # path('corporate/stripe-hook/',views.StripeHook.as_view(),name='stripe-hook')
]