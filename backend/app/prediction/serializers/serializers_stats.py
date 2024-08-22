from rest_framework import serializers
from user.serializers.serializers_user import UserSlimSerializer
from ..models import PredictionLog, UserWebsiteInteraction

class StatsSerializer(serializers.ModelSerializer):
    legit = serializers.IntegerField(read_only=True)
    total = serializers.IntegerField(read_only=True)
    class Meta:
        model = PredictionLog
        fields = ['legit','total']

class CorporateStatsSerializer(serializers.ModelSerializer):
    user = UserSlimSerializer(read_only=True)
    legit = serializers.IntegerField(read_only=True)
    total = serializers.IntegerField(read_only=True)
    class Meta:
        model = UserWebsiteInteraction
        fields = ['user','legit','total']
