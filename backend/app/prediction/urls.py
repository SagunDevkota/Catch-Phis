from django.urls import path,include,reverse
from rest_framework.routers import DefaultRouter
from .views.views_predictionlog import PredictionViewSet
from .views.views_stats import StatsViewSet
from .views.views_extension_token_validator import ValidateExtensionTokenApiView

router = DefaultRouter()
router.register(prefix='predict',viewset=PredictionViewSet,basename='predict')
router.register(prefix='stats',viewset=StatsViewSet,basename='stats')

app_label = 'predict'

urlpatterns = [
    path('',include(router.urls)),
    path('validate-extension-token/',ValidateExtensionTokenApiView.as_view(),name='token-extension-validator')
]
