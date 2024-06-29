from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import CorporateDetail,CorporateUser

class CorporateDetailAdmin(admin.ModelAdmin):
    list_display = ["id","company_name","contact_email","contact_phone","created_at"]
    readonly_fields = ['created_at']

class CorporateUserAdmin(admin.ModelAdmin):
    list_display = ['id','email','role','company_name']

    def email(self,obj):
        return obj.user.email
    
    def company_name(self,obj):
        return obj.corporate_details.company_name


admin.site.register(CorporateDetail,CorporateDetailAdmin)
admin.site.register(CorporateUser,CorporateUserAdmin)