from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from corporate.models import CorporateUser
from datetime import date

class AdminUserStatsPermission(BasePermission):
    def has_permission(self, request, view):
        if(request.user and request.user.is_authenticated):
            if(request.user.account_type=='corporate'):
                user = CorporateUser.objects.prefetch_related('corporate_details').filter(user=request.user).first()
                if(not user or user.role!='admin'):
                    raise PermissionDenied({"detail":"User is not admin."})
                if(user.corporate_details.activated==False):
                    raise PermissionDenied({"detail":"Corporate Not Activated."})
                if(user.corporate_details.subscription_expires_at<date.today()):
                    raise PermissionDenied({"detail":"Corporate Subscription Expired."})
                return True
            raise PermissionDenied({"detail":"User type is not corporate."})
        return False