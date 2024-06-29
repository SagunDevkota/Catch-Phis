from rest_framework.permissions import BasePermission
from rest_framework.exceptions import NotAuthenticated

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
                if(CorporateUser.objects.filter(user=user,role='admin').count()>=1):
                    return True
                return False
            return False
        except AttributeError:
            raise NotAuthenticated()