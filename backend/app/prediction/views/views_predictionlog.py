from django.db import transaction
from django.core.cache import cache
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status,exceptions
from drf_spectacular.utils import extend_schema,OpenApiParameter
from ..serializers.serializers_websitelog import WebsiteLogSerializer
from ..models import PredictionLog, UserWebsiteInteraction, LegitDomain
from ..utils.analyze import Analyze
from ..authentication import CustomUserAuthentication
from access_control_list.models import AccessControl

class PredictionViewSet(GenericViewSet,CreateModelMixin):
    serializer_class = WebsiteLogSerializer
    authentication_classes = [CustomUserAuthentication]
    permission_classes = [AllowAny]
    queryset = PredictionLog.objects.all()

    def perform_create(self, serializer):
        analyze = Analyze(serializer.validated_data)
        cached = cache.get(analyze.get_domain())
        if(cached):
            return cached
        acl = AccessControl.objects.filter(domain=analyze.get_domain()).first()
        if(acl):
            if(acl.domain_type=='whitelist'):
                cache.set(analyze.get_domain(),{"svc_pca":1,"xgboost_pca":1})
                return {"svc_pca":1,"xgboost_pca":1}
            else:
                cache.set(analyze.get_domain(),{"svc_pca":0,"xgboost_pca":0})
                return {"svc_pca":0,"xgboost_pca":0}
        log = self.get_queryset().filter(domain=analyze.get_domain()).first()
        if(log):
            cache.set(analyze.get_domain(),{"svc_pca":log.svc_pca,"xgboost_pca":log.xgboost_pca})
            return {"svc_pca":log.svc_pca,"xgboost_pca":log.xgboost_pca}
        try:
            legit_domain = LegitDomain.objects.filter(domain=analyze.get_domain()).first()
            if(legit_domain):
                data = analyze.result(predictions=False)
                data["svc_pca"]=1
                data["xgboost_pca"]=1
            else:
                data = analyze.result(predictions=True)
        except Exception as e:
            raise exceptions.ValidationError({"error":e})
        with transaction.atomic():
            saved = serializer.save(**data)
            UserWebsiteInteraction.objects.create(user=self.request.user,website_log=saved)
        cache.set(analyze.get_domain(),{"svc_pca":data['svc_pca'],"xgboost_pca":data['xgboost_pca']})
        return {"svc_pca":data['svc_pca'],"xgboost_pca":data['xgboost_pca']}

    @extend_schema( 
             parameters=[ 
                 OpenApiParameter( 
                     name='token', 
                     type=str, 
                     location=OpenApiParameter.HEADER, 
                     default='string', 
                     description='Extension token', 
                 ), 
                 OpenApiParameter( 
                     name='validator', 
                     type=str, 
                     location=OpenApiParameter.HEADER, 
                     default='string', 
                     description='extension validator', 
                 ),
             ], 
         ) 
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(response, status=status.HTTP_201_CREATED, headers=headers)