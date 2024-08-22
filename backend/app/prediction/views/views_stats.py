from django.db.models import Case,When,Value,Count,IntegerField,Subquery,Sum
from django.contrib.auth import get_user_model
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.pagination import PageNumberPagination
from drf_spectacular.openapi import OpenApiParameter 
from drf_spectacular.utils import extend_schema
from corporate.models import CorporateUser
from ..permissions import AdminUserStatsPermission
from ..models import UserWebsiteInteraction
from ..serializers.serializers_stats import StatsSerializer,CorporateStatsSerializer
from datetime import date,timedelta,datetime

class StatsViewSet(GenericViewSet,ListModelMixin):
    serializer_class = StatsSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination
    queryset = UserWebsiteInteraction.objects.prefetch_related('website_log','user').annotate(
            is_legit=Case(
                When(website_log__svc_pca=0, then=Value(0)),
                When(website_log__xgboost_pca=0, then=Value(0)),
                default=Value(1),
                output_field=IntegerField()
            )
        ).order_by('-interaction_datetime')
    
    def get_permissions(self):
        self.admin = True if self.request.query_params.get('admin') == 'true' else False
        if(self.admin):
            return [AdminUserStatsPermission()]
        return super().get_permissions()
    
    def get_serializer_class(self):
        if(self.admin):
            return CorporateStatsSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        today = date.today()
        from_date = datetime.strptime(self.request.query_params.get("from",str(today-timedelta(days=30))),"%Y-%m-%d").date()
        to_date = datetime.strptime(self.request.query_params.get("to",str(today)),"%Y-%m-%d").date()
        if(self.admin):
            corporate_details_subquery = CorporateUser.objects.filter(
                user=self.request.user
            ).values('corporate_details')
            corporate_users_with_same_details = CorporateUser.objects.filter(
                corporate_details=Subquery(corporate_details_subquery)
            ).values_list('user_id', flat=True)
            queryset = super().get_queryset().filter(user__in=corporate_users_with_same_details)
        else:
            queryset = super().get_queryset().filter(user=self.request.user)

        queryset = queryset.filter(
            interaction_datetime__date__gte=from_date,
            interaction_datetime__date__lte=to_date
        )
        queryset = queryset.values('user').annotate(
            total=Count('id'),
            legit=Sum('is_legit')
        ).order_by('user')

        for entry in queryset:
            entry['user'] = get_user_model().objects.get(id=entry['user'])

        return queryset
    
    @extend_schema(parameters=[
        OpenApiParameter(name='from',type=date,description="Start date for stats.yyyy-mm-dd defaults to 30 days before"),
        OpenApiParameter(name='to',type=date,description="Start date for stats.yyyy-mm-dd defaults to current date."),
        OpenApiParameter(name='admin',type=bool,description="Is corporate admin trying to view stats of organization?")
        ])
    def list(self, request, *args, **kwargs):
        print(self.get_queryset())
        return super().list(request, *args, **kwargs)