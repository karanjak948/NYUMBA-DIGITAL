from rest_framework.permissions import BasePermission
from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "email",
            "phone",
            "role",
            "avatar",
            "date_joined",
        ]

        read_only_fields = [
            "id",
            "username",
            "role",
            "date_joined",
        ]

class IsLandlord(BasePermission):
    def has_permission(self, request, view):
        # Ensure user is logged in and is landlord
        return request.user and request.user.is_authenticated and request.user.role == 'landlord'
    
class IsTenant(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'tenant'