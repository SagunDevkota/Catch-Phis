from rest_framework.serializers import ModelSerializer
from ..models import PredictionLog

class WebsiteLogSerializer(ModelSerializer):
    class Meta:
        model = PredictionLog
        fields = ['url','favicon','has_title','title',
                  'has_copyright_info','has_social_media_links',
                  'has_description','has_external_form_submit',
                  'has_hidden_field',
                  'no_of_js','no_of_self_ref']
        read_only_fields = list(set(PredictionLog._meta.fields) - set(('corrected_output',)))
        