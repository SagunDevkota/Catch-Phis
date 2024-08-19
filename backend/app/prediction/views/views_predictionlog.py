from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.pagination import CursorPagination
from rest_framework.response import Response
from rest_framework import status,exceptions
from drf_spectacular.utils import extend_schema,OpenApiParameter
from ..serializers import WebsiteLogSerializer
from ..models import PredictionLog, UserWebsiteInteraction
from ..utils.analyze import Analyze
from ..authentication import CustomUserAuthentication

class PredictionViewSet(GenericViewSet,CreateModelMixin):
    serializer_class = WebsiteLogSerializer
    authentication_classes = [CustomUserAuthentication]
    permission_classes = [AllowAny]
    pagination_class = CursorPagination
    queryset = PredictionLog.objects.all()

    def perform_create(self, serializer):
        analyze = Analyze(serializer.validated_data)
        log = self.get_queryset().filter(domain=analyze.get_domain()).first()
        if(log):
            return {"svc_pca":log.svc_pca,"xgboost_pca":log.xgboost_pca}
        try:
            data = analyze.result()
        except Exception as e:
            raise exceptions.ValidationError({"error":e})
        saved = serializer.save(**data)
        UserWebsiteInteraction.objects.create(user=self.request.user,website_log=saved)
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