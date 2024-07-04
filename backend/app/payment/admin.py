from django.contrib import admin
from .models import Subscription

class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['session_id','subscription_id']

admin.site.register(Subscription,SubscriptionAdmin)