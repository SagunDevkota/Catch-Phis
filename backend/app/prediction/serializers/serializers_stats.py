from rest_framework import serializers
from user.serializers.serializers_user import UserSlimSerializer
from ..models import PredictionLog, UserWebsiteInteraction

class StatsSerializer(serializers.ModelSerializer):
    is_legit = serializers.IntegerField(read_only=True)
    total = serializers.IntegerField(read_only=True)
    class Meta:
        model = PredictionLog
        fields = ['is_legit','total']

class CorporateStatsSerializer(serializers.ModelSerializer):
    user = UserSlimSerializer(read_only=True)
    is_legit = serializers.IntegerField(read_only=True)
    total = serializers.IntegerField(read_only=True)
    class Meta:
        model = UserWebsiteInteraction
        fields = ['user','is_legit','total']
