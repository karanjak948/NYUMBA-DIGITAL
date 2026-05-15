from django.contrib.auth import get_user_model

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    RegisterSerializer,
    CustomTokenSerializer,
)

User = get_user_model()


# =========================================
# REGISTER VIEW
# =========================================
class RegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        data = request.data.copy()

        # Force role lowercase
        if "role" in data:
            data["role"] = data["role"].lower()

        serializer = RegisterSerializer(data=data)

        if serializer.is_valid():

            user = serializer.save()

            return Response(
                {
                    "message": "User created successfully",
                    "role": user.role,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "error": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


# =========================================
# LOGIN VIEW (JWT)
# =========================================
class CustomLoginView(TokenObtainPairView):

    permission_classes = [AllowAny]

    serializer_class = CustomTokenSerializer