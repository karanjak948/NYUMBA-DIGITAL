from rest_framework.permissions import BasePermission

class IsLandlord(BasePermission):
    def has_permission(self, request, view):
        # Ensure user is logged in and is landlord
        return request.user and request.user.is_authenticated and request.user.role == 'landlord'
    
class IsTenant(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'tenant'