from rest_framework.permissions import BasePermission
from corporate.models import CorporateUser

class AdminUserStatsPermission(BasePermission):
    def has_permission(self, request, view):
        if(request.user and request.user.is_authenticated):
            if(request.user.account_type=='corporate'):
                user = CorporateUser.objects.prefetch_related('corporate_details').filter(user=request.user).first()
                if(user.role=='admin' and user.corporate_details.subscribed==True):
                    return True
        return False