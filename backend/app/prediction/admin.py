from django.contrib import admin
from .models import PredictionLog,UserWebsiteInteraction,LegitDomain

class PredictionLogAdmin(admin.ModelAdmin):
    list_display = ['id','domain','svc_pca','xgboost_pca']

class WebsiteInteractionAdmin(admin.ModelAdmin):
    list_display = ['name','website_log','interaction_datetime']

    def name(self,obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    
class LegitDomainAdmin(admin.ModelAdmin):
    list_display = ['domain']
    readonly_fields = ['domain']
    search_fields = ['domain']


admin.site.register(PredictionLog,PredictionLogAdmin)
admin.site.register(UserWebsiteInteraction,WebsiteInteractionAdmin)
admin.site.register(LegitDomain,LegitDomainAdmin)