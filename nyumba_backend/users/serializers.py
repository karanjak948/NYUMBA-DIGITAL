from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# 🔥 USER SERIALIZER
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone']


# =========================================
# 🔥 REGISTER SERIALIZER (FIXED)
# =========================================
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'phone']
        extra_kwargs = {
            'password': {'write_only': True},
            'phone': {'required': False, 'allow_blank': True}
        }

    # 🔥 VALIDATE ROLE
    def validate_role(self, value):
        value = value.lower()

        if value not in ['tenant', 'landlord', 'admin']:
            raise serializers.ValidationError("Invalid role")

        return value

    # 🔥 HASH PASSWORD
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


# =========================================
# 🔥 JWT CUSTOM SERIALIZER
class CustomTokenSerializer( TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):

        token = super().get_token(user)

        token["role"] = user.role

        return token

    def validate(self, attrs):

        data = super().validate(attrs)

        user = self.user

        data["role"] = (
            "admin" if user.is_superuser
            else user.role
        )

        data["username"] = user.username
        data["email"] = user.email

        return data

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "email",
            "phone",
            "role",
            "date_joined",
        ]

        read_only_fields = [
            "id",
            "username",
            "role",
            "date_joined",
        ]