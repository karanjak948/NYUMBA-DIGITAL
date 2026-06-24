from django.contrib.auth import get_user_model

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from django.contrib.auth.hashers import check_password
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)

from .serializers import (
    RegisterSerializer,
    CustomTokenSerializer,
    ProfileSerializer,
)

User = get_user_model()


# =========================================
# REGISTER VIEW
# =========================================
class RegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        data = request.data.copy()

        if "role" in data:
            data["role"] = (
                data["role"].lower()
            )

        serializer = RegisterSerializer(
            data=data
        )

        if serializer.is_valid():

            user = serializer.save()

            return Response(
                {
                    "message":
                        "User created successfully",

                    "role":
                        user.role,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "error":
                    serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


# =========================================
# LOGIN VIEW (JWT)
# =========================================
class CustomLoginView(
    TokenObtainPairView
):

    permission_classes = [AllowAny]

    serializer_class = (
        CustomTokenSerializer
    )


# =========================================
# PROFILE VIEW
# =========================================
class ProfileView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        serializer = ProfileSerializer(
            request.user
        )

        return Response(
            serializer.data
        )

    def patch(self, request):

        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
class ChangePasswordView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        old_password = request.data.get(
            "old_password"
        )

        new_password = request.data.get(
            "new_password"
        )

        user = request.user

        if not user.check_password(
            old_password
        ):

            return Response(
                {
                    "error":
                    "Current password is incorrect"
                },
                status=400
            )

        user.set_password(
            new_password
        )

        user.save()

        return Response(
            {
                "message":
                "Password changed successfully"
            }
        )
    
# class ProfileView(RetrieveUpdateAPIView):

#     serializer_class = UserSerializer
#     permission_classes = [IsAuthenticated]

#     def get_object(self):
#         return self.request.user