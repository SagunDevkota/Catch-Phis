from django.db import transaction, IntegrityError
from django.http import QueryDict
from django.core.cache import cache
from rest_framework import serializers
from corporate.models import CorporateDetail,CorporateUser
from user.serializers.serializers_user import UserDetailsSerializer
from config.settings.common_tasks import send_email
import random

class CorporateDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CorporateDetail
        fields = ['id','company_name','contact_email','contact_phone','created_at','activated','subscribed','subscription_expires_at']
        read_only_fields = ['created_at','activated']

    def to_internal_value(self, data):
        if isinstance(data, QueryDict):
            data = data.copy()
        data['contact_email'] = data['contact_email'].strip().lower()
        return super().to_internal_value(data)

    def create(self, validated_data):
        try:
            with transaction.atomic():
                role = 'admin'
                corporate_detail = CorporateDetail.objects.create(**validated_data)
                corporate_user = CorporateUser.objects.create(user=self.context['request'].user,role=role,corporate_details=corporate_detail)
                token = random.randint(111111,999999)
                cache.set(token,validated_data["contact_email"],timeout=180)
                send_email.delay(subject="Activate Corporate Account - Catch Phis",
                            message=f"The activation key for {validated_data['contact_email']} is {token} and will expire in 180 seconds.",to_list=[validated_data['contact_email']])
                return corporate_detail
        except IntegrityError as e:
            raise serializers.ValidationError("An error occurred while creating the corporate user.")

class CorporateUserSerializer(serializers.ModelSerializer):
    user = UserDetailsSerializer(read_only=True)
    corporate_details = serializers.SerializerMethodField()
    class Meta:
        model = CorporateUser
        fields = ['id','user','role','corporate_details']

    def get_corporate_details(self,obj):
        return obj.corporate_details.company_name

class CorporateUserCreateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    phone = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField()
    class Meta:
        model = CorporateUser
        fields = ['first_name','last_name','phone','email','password','role']

class CorporateActivationSerializer(serializers.Serializer):
    token = serializers.CharField()
    class Meta:
        fields = ['token']