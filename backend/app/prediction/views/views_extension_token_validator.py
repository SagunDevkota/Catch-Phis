from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
import random
import string

class ValidateExtensionTokenApiView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        request={
            'application/json': {
                    'example': {'token':'string'}
                }
        },
        description='Validate extension token',
        responses={
            200: OpenApiResponse(
                description='Validator generated successfully',
                response={
                    'type': 'object',
                    'properties': {
                        'validator': {
                            'type': 'string',
                            'description': 'Generated validator string'
                        }
                    }
                }
            ),
            404: OpenApiResponse(description='User not found'),
            400: OpenApiResponse(description='Bad request, token is required')
        }
    )
    def post(self,request):
        token = request.data.get('token',None)
        if token:
            try:
                user = get_object_or_404(get_user_model(),extension_token=token)
            except ValidationError:
                return Response({"error":"Invalid token"},status=status.HTTP_400_BAD_REQUEST)
            validator = ''.join(random.choices(string.ascii_letters, k=10))
            user.extension_validator = validator
            user.save()
            return Response({"validator":validator},status=status.HTTP_200_OK)
        return Response({"error":"No Token Found"},status=status.HTTP_400_BAD_REQUEST)
