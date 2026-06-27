from django.contrib.auth import get_user_model
from django.db.models import Sum

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import ( AllowAny, IsAuthenticated,)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from bookings.models import Booking
from properties.models import Property

from .serializers import ( RegisterSerializer, ProfileSerializer, CustomTokenSerializer,)



User = get_user_model()


# =========================================
# REGISTER VIEW
# =========================================
class RegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        data = request.data.copy()

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
            {"error": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


# =========================================
# JWT TOKEN SERIALIZER
# =========================================
class CustomTokenSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["role"] = (
            "admin" if user.is_superuser else user.role
        )
        token["username"] = user.username

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user

        data["username"] = user.username
        data["role"] = (
            "admin" if user.is_superuser else user.role
        )

        return data


# =========================================
# LOGIN VIEW
# =========================================
class CustomLoginView(TokenObtainPairView):

    permission_classes = [AllowAny]
    serializer_class = CustomTokenSerializer


# =========================================
# PROFILE VIEW
# =========================================
class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


# =========================================
# CHANGE PASSWORD
# =========================================
class ChangePasswordView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        user = request.user

        if not user.check_password(old_password):
            return Response(
                {"error": "Current password is incorrect"},
                status=400,
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password changed successfully"}
        )


# =========================================
# ADMIN DASHBOARD
# =========================================
class AdminDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        # STRICT ROLE CHECK
        if not (user.is_superuser or user.role == "admin"):
            return Response(
                {"error": "Unauthorized"},
                status=403,
            )

        total_users = User.objects.count()
        total_landlords = User.objects.filter(role="landlord").count()
        total_tenants = User.objects.filter(role="tenant").count()

        total_properties = Property.objects.count()
        total_bookings = Booking.objects.count()

        total_revenue = (
            Booking.objects.filter(status="approved")
            .aggregate(total=Sum("booking_fee"))["total"]
            or 0
        )

        return Response(
            {
                "total_users": total_users,
                "total_landlords": total_landlords,
                "total_tenants": total_tenants,
                "total_properties": total_properties,
                "total_bookings": total_bookings,
                "total_revenue": total_revenue,
            }
        )
    
class AdminPropertyListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if not (request.user.is_superuser or request.user.role == "admin"):
            return Response({"error": "Unauthorized"}, status=403)

        properties = Property.objects.all()

        data = [{
            "id": p.id,
            "title": p.title,
            "price": p.price,
            "location": p.location,
            "status": p.status,
            "landlord": p.landlord.username,
        } for p in properties]

        return Response(data)

class AdminUserListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if not (request.user.is_superuser or request.user.role == "admin"):
            return Response({"error": "Unauthorized"}, status=403)

        users = User.objects.all()

        data = [{
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role,
            "date_joined": u.date_joined,
        } for u in users]

        return Response(data)
    
class AdminBookingListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if not (request.user.is_superuser or request.user.role == "admin"):
            return Response({"error": "Unauthorized"}, status=403)

        bookings = Booking.objects.all()

        data = [{
            "id": b.id,
            "property": b.property.title,
            "tenant": b.tenant.username,
            "status": b.status,
            "booking_fee": b.booking_fee,
            "date": b.booking_date,
        } for b in bookings]

        return Response(data)

 
class SuspendUserView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):

        if request.user.role != "admin":
            return Response({"error": "Unauthorized"}, status=403)

        try:
            user = User.objects.get(id=user_id)
            user.is_active_account = False
            user.save()

            return Response({"message": "User suspended"})

        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)