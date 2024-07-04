    
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import APIException,ValidationError
from rest_framework import status
from rest_framework.decorators import action
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny
from drf_spectacular.openapi import OpenApiParameter 
from drf_spectacular.utils import extend_schema_view,extend_schema
from config.settings.documentation import generate_doc
from .models import Subscription
from corporate.models import CorporateUser
from corporate.permissions import permissions_corporate
import stripe
from stripe._error import InvalidRequestError,APIConnectionError
from typing import Any
import datetime

@extend_schema_view(
    post=extend_schema(
        generate_doc(
            method="POST",
            description="Initiate checkout payment.",
            preconditions=["User is type corporate.","User must have admin role."],
            postconditions=[""]
            )
    )
)
class CorporateCreateCheckoutAPIView(ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions_corporate.CorporateUserPermission]

    def __init__(self, **kwargs: Any) -> None:
        stripe.api_key = settings.STRIPE_SECRET_KEY
        super().__init__(**kwargs)

    def get_permissions(self):
        if self.action in ['stripe_hook','session_status']:
            return [AllowAny()]
        return super().get_permissions()
    
    def creation_session(self,email,request):
        return stripe.checkout.Session.create(
            ui_mode = 'embedded',
            line_items=[
                {
                    # Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    'price': 'price_1PT1hl065Mm9w2p215FcDm9W',
                    'quantity': 1
                },
            ],
            mode='subscription',
            customer_email=email,
            return_url=request.scheme+"://"+request.get_host() + '/return.html?session_id={CHECKOUT_SESSION_ID}',
        )
    
    @action(methods=["post"],detail=False,url_path='create-checkout-session')
    def create_checkout_session(self,request,*args,**kwargs):
        user = CorporateUser.objects.select_related('corporate_details').filter(user=self.request.user).first()
        if(user and user.corporate_details.subscribed==True):
            return Response({"status":"Corporate Account already activated"})
        else:
            try:
                email = user.corporate_details.contact_email
                session = self.creation_session(email,request)
                Subscription.objects.create(session_id=session["id"],corporate=user.corporate_details)
            except Exception as e:
                raise APIException(detail=str(e),code=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({"clientSecret":session["client_secret"]})
    
    def retrieve_session(self,session_id):
        return stripe.checkout.Session.retrieve(session_id)
    
    @extend_schema(parameters=[OpenApiParameter(name='session_id',type=str,description="Add stripe session id.")])
    @action(detail=False,methods=["GET"],url_path="session-status")
    def session_status(self,request,*args,**kwargs):
        session_id = self.request.query_params.get('session_id','')
        try:
            session = self.retrieve_session(session_id)
        except InvalidRequestError:
            return Response({"error":f"Session ID '{session_id}' doesn't exist."},status=status.HTTP_400_BAD_REQUEST)
        except APIConnectionError:
            return Response({"error":"Service unavailable"},status=status.HTTP_503_SERVICE_UNAVAILABLE)
        subscription = get_object_or_404(Subscription,session_id=session_id)
        subscription.subscription_id = session["subscription"]
        if(session["subscription"]):
            subscription.corporate.subscribed = True
            subscription.corporate.subscription_expires_at = datetime.date.today() + datetime.timedelta(days=30)
            subscription.corporate.save()
        subscription.save()
        return Response({"status":session["status"],"customer_email":session["customer_details"]["email"]})
    
    @action(detail=False,methods=["POST"],url_path="stripe-hook")
    def stripe_hook(self,request,*args,**kwargs):
        event = None
        payload = request.body
        try:
            sig_header = request.headers['STRIPE_SIGNATURE']
        except KeyError as e:
            raise ValidationError(detail={"error":"Invalid Signature."}, code=status.HTTP_400_BAD_REQUEST)
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            raise ValidationError(detail={"error":"Invalid Payload."},code=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            raise ValidationError(detail={"error":"Invalid STRIPE_WEBHOOK_SECRET."},code=status.HTTP_400_BAD_REQUEST)
        
        subscription = get_object_or_404(Subscription.objects.select_related('corporate'),subscription_id=event['data']['object']['id'])
        # Handle the event
        if event['type'] == 'customer.subscription.created':
            subscription.corporate.subscribed = True
            subscription.corporate.subscription_expires_at = datetime.date.today()+datetime.timedelta(days=30)
        elif event['type'] == 'customer.subscription.deleted':
            subscription.corporate.subscribed = False
            subscription.corporate.subscription_expires_at = None
        elif event['type'] == 'customer.subscription.paused':
            subscription.corporate.subscribed = False
            subscription.corporate.subscription_expires_at = None
        elif event['type'] == 'customer.subscription.updated':
            subscription.corporate.subscribed = True
            subscription.corporate.subscription_expires_at = datetime.date.today()+datetime.timedelta(days=30)
        else:
            return Response({"error":"Invalid Event"},status=status.HTTP_400_BAD_REQUEST)
        subscription.corporate.save()
        return Response({"success":True})

# class CorporateCheckoutStatus(APIView):
#     def __init__(self, **kwargs: Any) -> None:
#         stripe.api_key = settings.STRIPE_SECRET_KEY
#         super().__init__(**kwargs)

#     @classmethod
#     def as_view(cls, **initkwargs):
#         view = super().as_view(**initkwargs)
#         view.cls.get = view.cls.session_status
#         return view

    
    
# class StripeHook(APIView):
#     @classmethod
#     def as_view(cls, **initkwargs):
#         view = super().as_view(**initkwargs)
#         view.cls.post = view.cls.stripe_hook
#         return view

    