from django.contrib import admin
from .models import AccessControl

class AccessControlAdmin(admin.ModelAdmin):
    """Admin view for whitelist model"""
    list_display = ['domain','domain_type','user']

admin.site.register(AccessControl,AccessControlAdmin)