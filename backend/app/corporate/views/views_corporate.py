from django.core.cache import cache
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.db import IntegrityError,transaction
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import (CreateModelMixin,
                                   DestroyModelMixin,
                                   UpdateModelMixin,
                                   ListModelMixin)
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from drf_spectacular.utils import extend_schema,extend_schema_view
from rest_framework_simplejwt.authentication import JWTAuthentication
import re
from ..permissions import permissions_corporate
from ..serializers.serializers_corporate import (
    CorporateDetailSerializer,
    CorporateUserSerializer,
    CorporateActivationSerializer,
    CorporateUserCreateSerializer)
from corporate.models import CorporateDetail,CorporateUser
from config.settings.documentation import generate_doc

@extend_schema_view(
    list=extend_schema(
        description=generate_doc(
            method='GET',
            description='Returns a company for a corporate user as a list.',
            preconditions=['User must be authenticated as account_type=`corporate`.'],
            postconditions=['Returns the company detail of the user.'])
    ),
    create=extend_schema(
        description=generate_doc(
            method='POST',
            description='Register a company for a corporate user.',
            preconditions=['User must be authenticated as account_type=`corporate`.'],
            postconditions=['Creates corporate details and corporate user assigned to the company with role as `admin`.',
                            'Send email to the registered corporate account for activation.'],
            notes=['Created company is inactive view payment endpoint to activate the company.'])
    ),
    destroy=extend_schema(
        description=generate_doc(
            method='DELETE',
            description='No Response Body',
            preconditions=['User must be authenticated as account_type=`corporate` and role `admin`.'],
            postconditions=['Removes the corporate account from system.'])
    ),
    update=extend_schema(
        description=generate_doc(
            method='PUT',
            description='Update a corporate detail.',
            preconditions=['User must be authenticated as account_type=`corporate`.',
                           'User must have role `admin`, user who created the corporate detail is automatically assigned as `admin`.'],
            postconditions=['Updates corporate details.'])
    ),
    partial_update=extend_schema(
        description=generate_doc(
            method='PATCH',
            description='Partial update a corporate detail.',
            preconditions=['User must be authenticated as account_type=`corporate`.',
                           'User must have role `admin`, user who created the corporate detail is automatically assigned as `admin`.'],
            postconditions=['Partially updates corporate details.'])
    ),
    activate=
    extend_schema(
        description=generate_doc(
            method='POST',
            description='Activate corporate details based on activation code received in the registered corporate account.',
            preconditions=['User must be authenticated as account_type=`corporate`.',
                           'User must have role `admin`, user who created the corporate detail is automatically assigned as `admin`.'],
            postconditions=['Account is activated and user assigned with corporate is allowed to perform various actions.'],)
    ),
)
class CorporateDetailViewSet(
    GenericViewSet,
    CreateModelMixin,
    DestroyModelMixin,
    UpdateModelMixin,
    ListModelMixin
    ):
    serializer_class = CorporateDetailSerializer
    permission_classes = [permissions_corporate.CorporateUserPermission]
    authentication_classes = [JWTAuthentication]
    queryset = CorporateDetail.objects.all()

    def get_queryset(self):
        return CorporateDetail.objects.prefetch_related('corporate_user_detail').filter(corporate_user_detail__user=self.request.user)

    def get_permissions(self):
        if(self.action == 'create'):
            return [permissions_corporate.CorporateDetailPermission()]
        return super().get_permissions()
    
    def get_serializer_class(self):
        if(self.action == 'activate'):
            return CorporateActivationSerializer
        return super().get_serializer_class()

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @action(detail=False, methods=["post"])
    def activate(self,request,*args,**kwargs):
        serialized_data = self.get_serializer(data=request.data)
        if(serialized_data.is_valid(raise_exception=True)):
            data = serialized_data.validated_data
            token = data['token']
            contact_email = cache.get(token)
            detail = get_object_or_404(CorporateDetail,contact_email=contact_email)
            detail.activated = True
            detail.save()
            return Response({"detail":f"Account activated for {contact_email}"})


@extend_schema_view(
    list=extend_schema(
        description=generate_doc(
            method='GET',
            description='Returns a lists of corporate user in a company.',
            preconditions=['User must be authenticated as account_type=`corporate` and role `admin`.'],
            postconditions=['Returns the list of users in a company.'])
    ),
    create=extend_schema(
        description=generate_doc(
            method='POST',
            description='Register a user for corporate. Role: admin/employee',
            preconditions=['User must be authenticated as account_type=`corporate` and role `admin`.'],
            postconditions=['Creates corporate user assigned to the company.',
                            'Account is automatically activated.'])
    ),
    destroy=extend_schema(
        description=generate_doc(
            method='DELETE',
            description='No Response Body',
            preconditions=['User must be authenticated as account_type=`corporate` and role `admin`.'],
            postconditions=['Removes the user from company.'])
    ),
    update=extend_schema(
        description=generate_doc(
            method='PUT',
            description='Update a corporate user\'s role.',
            preconditions=['User must be authenticated as account_type=`corporate` and role `admin`.'],
            postconditions=['Updates corporate user\'s role.'])
    ),
    partial_update=extend_schema(
        description=generate_doc(
            method='PATCH',
            description='Partially update a corporate user\'s role.',
            preconditions=['User must be authenticated as account_type=`corporate` and role `admin`.'],
            postconditions=['Partially Updates corporate user\'s role.'])
    ),
)
class CorporateUserViewSet(
    GenericViewSet,
    CreateModelMixin,
    DestroyModelMixin,
    UpdateModelMixin,
    ListModelMixin
    ):
    serializer_class = CorporateUserSerializer
    permission_classes = [permissions_corporate.CorporateUserPermission]
    authentication_classes = [JWTAuthentication]
    queryset = CorporateUser.objects.all()

    
    def get_serializer_class(self):
        if(self.action == 'create'):
            return CorporateUserCreateSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer):
        corporate_detail = CorporateUser.objects.select_related('corporate_details').filter(user=self.request.user).first().corporate_details
        if(serializer.is_valid(raise_exception=True)):
            data = serializer.validated_data
            try:
                with transaction.atomic():
                    user = get_user_model().objects.create_user(
                        email=data['email'],
                        password=data['password'],
                        first_name=data['first_name'],
                        last_name=data['last_name'],
                        is_active=True,
                        account_type='corporate',
                        phone=data['phone'],
                        parent_user=self.request.user)
                    CorporateUser.objects.create(role=data['role'],user=user,corporate_details=corporate_detail)
            except IntegrityError as e:
                match = re.search(r'DETAIL:  (.*)', e.args[0])
                raise ValidationError({"error":match.group(1)})