from rest_framework.serializers import ModelSerializer
from .models import AccessControl
import urllib

class AccessControlSerializer(ModelSerializer):
    class Meta:
        model = AccessControl
        fields = ['id','domain_type','domain']
        read_only_fields = ['id']

    def create(self, validated_data):
        url_parser = urllib.parse.urlparse(validated_data['domain'])
        domain = url_parser.netloc.replace("www.","")
        if(not domain):
            domain = validated_data['domain'].replace("www.","")
        validated_data['domain'] = domain
        return super().create(validated_data)