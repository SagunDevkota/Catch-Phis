from django.urls import path,include,reverse
from rest_framework.routers import DefaultRouter
from .views.views_predictionlog import PredictionViewSet
from .views.views_extension_token_validator import ValidateExtensionTokenApiView

router = DefaultRouter()
router.register(prefix='',viewset=PredictionViewSet,basename='predict')

app_label = 'predict'

urlpatterns = [
    path('predict/',include(router.urls)),
    path('validate-extension-token/',ValidateExtensionTokenApiView.as_view(),name='token-extension-validator')
]
