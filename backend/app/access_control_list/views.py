from django.db.utils import IntegrityError
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import (CreateModelMixin,
                                   DestroyModelMixin,
                                   ListModelMixin)
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import AccessControlSerializer
from .models import AccessControl

class AccessControlViewSet(
    GenericViewSet,
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin
    ):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination
    serializer_class = AccessControlSerializer
    queryset = AccessControl.objects.all().order_by('-id')


    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """domain_type = whitelist/blacklist"""
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            raise ValidationError({"detail":"Domain already exists."})
