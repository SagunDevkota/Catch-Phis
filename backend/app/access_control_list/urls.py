from django.urls import include,path
from rest_framework.routers import DefaultRouter
from .views import AccessControlViewSet

router = DefaultRouter()
router.register(prefix='acl',viewset=AccessControlViewSet,basename='acl')

app_label = 'acl'

urlpatterns = [
    path('',include(router.urls))
]