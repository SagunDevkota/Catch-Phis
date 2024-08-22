from rest_framework.permissions import BasePermission
from rest_framework.exceptions import NotAuthenticated,PermissionDenied

from corporate.models import CorporateUser

class CorporateDetailPermission(BasePermission):
    """Permission class to create corporate details."""
    def has_permission(self, request,view):
        try:
            if(request.user and request.user.account_type=='corporate' and request.user.is_authenticated):
                return True
            return False
        except AttributeError:
            raise NotAuthenticated()


class CorporateUserPermission(BasePermission):
    """Permission class view corporate detail."""
    def has_permission(self, request, view):
        try:
            user = request.user
            if(user and user.account_type=='corporate' and user.is_authenticated):
                if(CorporateUser.objects.select_related('corporate_details').filter(user=user,role='admin',corporate_details__activated=True).count()>=1):
                    return True
                raise PermissionDenied({"detail":"Corporate Not activated or user is not admin."})
            raise PermissionDenied({"detail":"User is not corporate type"})
        except AttributeError:
            raise NotAuthenticated()