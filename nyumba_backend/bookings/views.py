from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Booking
from .serializers import BookingSerializer

from properties.models import Property
from users.permissions import IsTenant


# =========================================
# 📌 BOOKING VIEWSET
# =========================================
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, IsTenant]

    # 🔥 CREATE BOOKING
    def create(self, request, *args, **kwargs):
        property_id = request.data.get('property')

        # 🔍 Validate property
        try:
            property_obj = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response(
                {"error": "Property not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # 🚫 Prevent double booking
        if property_obj.status != 'available':
            return Response(
                {"error": "House is not available"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Create booking
        booking = Booking.objects.create(
            property=property_obj,
            tenant=request.user,
            booking_fee=request.data.get('booking_fee'),
        )

        # 🔄 Update property status
        property_obj.status = 'booked'
        property_obj.save()

        return Response(
            BookingSerializer(booking).data,
            status=status.HTTP_201_CREATED
        )

    # 🔍 FILTER BOOKINGS BY ROLE
    def get_queryset(self):
        user = self.request.user

        if user.role == 'admin':
            return Booking.objects.all()

        elif user.role == 'tenant':
            return Booking.objects.filter(tenant=user)

        elif user.role == 'landlord':
            return Booking.objects.filter(property__landlord=user)

        return Booking.objects.none()


# =========================================
# 📌 APPROVE BOOKING (LANDLORD CONTROL)
# =========================================
class ApproveBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        booking_id = request.data.get("booking")

        # 🔍 Get booking
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # 🔐 Ensure only landlord can approve
        if booking.property.landlord != request.user:
            return Response(
                {"error": "Not allowed"},
                status=status.HTTP_403_FORBIDDEN
            )

        # ✅ Approve booking
        booking.status = "approved"
        booking.save()

        return Response({"message": "Booking approved"})