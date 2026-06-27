from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from notifications.models import Notification

from .models import Booking
from .serializers import BookingSerializer
from properties.models import Property
from decimal import Decimal


# =========================================
# 📌 BOOKING VIEWSET
# =========================================
class BookingViewSet(viewsets.ModelViewSet):

    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    # =========================================
    # 📌 FILTER BOOKINGS BY ROLE
    # =========================================
    def get_queryset(self):

        user = self.request.user

        if user.role == "admin":
            return Booking.objects.all()

        elif user.role == "tenant":
            return Booking.objects.filter(
                tenant=user
            )

        elif user.role == "landlord":
            return Booking.objects.filter(
                property__landlord=user
            )

        return Booking.objects.none()

    # =========================================
    # 📌 CREATE BOOKING
    # =========================================
    def create(self, request, *args, **kwargs):

        # 🔥 ONLY TENANTS CAN BOOK
        if request.user.role != "tenant":

            return Response(
                {
                    "error": "Only tenants can book"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # 🔥 CHECK IF TENANT ALREADY HAS A HOUSE
        existing_booking = Booking.objects.filter(
            tenant=request.user,
            status__in=["pending", "approved"]
        ).first()

        if existing_booking:

            return Response(
                {
                    "error": (
                        f"You already have a "
                        f"{existing_booking.property.property_type} booked."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🔥 GET PROPERTY ID
        property_id = request.data.get("property")

        # 🔥 CHECK PROPERTY EXISTS
        try:

            property_obj = Property.objects.get(
                id=property_id
            )

            print("PROPERTY PRICE:", property_obj.price)
            print("PROPERTY TYPE:", type(property_obj.price))

            booking_fee = (
                property_obj.price *
                Decimal("0.10")
            )

            print("BOOKING FEE:", booking_fee)

        except Property.DoesNotExist:

            return Response(
                {
                    "error": "Property not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # 🔥 PROPERTY MUST BE AVAILABLE
        if property_obj.status != "available":

            return Response(
                {
                    "error": "House is not available"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🔥 CREATE BOOKING

        booking_fee = (
            property_obj.price *
            Decimal("0.10")
        )

        booking = Booking.objects.create(
            property=property_obj,
            tenant=request.user,
            booking_fee=booking_fee,
            status="pending"
        )

        # 🔔 NOTIFY LANDLORD
        Notification.objects.create(
            user=property_obj.landlord,
            message=(
                f"{request.user.username} "
                f"booked {property_obj.title}"
            )
        )

        # 🔥 UPDATE PROPERTY STATUS
        property_obj.status = "booked"
        property_obj.save()

        return Response(
            BookingSerializer(booking).data,
            status=status.HTTP_201_CREATED
        )


# =========================================
# 📌 APPROVE BOOKING
# =========================================
class ApproveBookingView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        booking_id = request.data.get("booking")

        try:

            booking = Booking.objects.get(
                id=booking_id
            )

        except Booking.DoesNotExist:

            return Response(
                {
                    "error": "Booking not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # 🔥 ONLY LANDLORDS
        if request.user.role != "landlord":

            return Response(
                {
                    "error": "Only landlords can approve"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # 🔥 OWNERSHIP CHECK
        if booking.property.landlord.id != request.user.id:

            return Response(
                {
                    "error": "You do not own this property"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # 🔥 ALREADY APPROVED
        if booking.status == "approved":

            return Response(
                {
                    "error": "Already approved"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🔥 APPROVE BOOKING
        booking.status = "approved"
        booking.save()

        property_obj = booking.property

        property_obj.status = "occupied"

        property_obj.save()

        Booking.objects.filter(
            property=booking.property
            ).exclude(
                id=booking.id
            ).update(
                status="cancelled"
            )

        # 🔔 NOTIFY TENANT
        Notification.objects.create(
            user=booking.tenant,
            message=(
                f"Your booking for "
                f"{booking.property.title} "
                f"has been approved."
            )
        )

        return Response(
            {
                "message": "Booking approved",
                "status": booking.status
            }
        )


from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import Booking
from properties.models import Property
from notifications.models import Notification


# =========================================
# 📌 ADMIN APPROVE BOOKING (OVERRIDE)
# =========================================
class AdminApproveBookingView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        # 🔥 STRICT ADMIN CHECK
        if not (request.user.is_superuser or request.user.role == "admin"):
            return Response(
                {"error": "Unauthorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        booking_id = request.data.get("booking")

        if not booking_id:
            return Response(
                {"error": "booking ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            booking = Booking.objects.get(id=booking_id)

        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # 🔥 ALREADY APPROVED CHECK
        if booking.status == "approved":
            return Response(
                {"error": "Booking already approved"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🔥 APPROVE BOOKING
        booking.status = "approved"
        booking.save()

        # 🔥 UPDATE PROPERTY STATUS
        property_obj = booking.property
        property_obj.status = "occupied"
        property_obj.save()

        # 🔥 CANCEL OTHER BOOKINGS FOR SAME PROPERTY
        Booking.objects.filter(
            property=property_obj
        ).exclude(
            id=booking.id
        ).update(status="cancelled")

        # 🔔 NOTIFY TENANT
        Notification.objects.create(
            user=booking.tenant,
            message=f"Your booking for {property_obj.title} has been approved by admin."
        )

        return Response({
            "message": "Booking approved by admin",
            "booking_id": booking.id,
            "status": booking.status
        })

# =========================================
# 📌 CANCEL BOOKING
# =========================================
class CancelBookingView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        booking_id = request.data.get("booking")

        try:

            booking = Booking.objects.get(
                id=booking_id
            )

        except Booking.DoesNotExist:

            return Response(
                {
                    "error": "Booking not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # 🔥 ONLY LANDLORDS
        if request.user.role != "landlord":

            return Response(
                {
                    "error": "Only landlords can cancel"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # 🔥 OWNERSHIP CHECK
        if booking.property.landlord.id != request.user.id:

            return Response(
                {
                    "error": "You do not own this property"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # 🔥 CANCEL BOOKING
        booking.status = "cancelled"
        booking.save()

        # 🔔 NOTIFY TENANT
        Notification.objects.create(
            user=booking.tenant,
            message=(
                f"Your booking for "
                f"{booking.property.title} "
                f"was cancelled."
            )
        )

        # 🔥 MAKE PROPERTY AVAILABLE AGAIN
        property_obj = booking.property
        property_obj.status = "available"
        property_obj.save()

        return Response(
            {
                "message": "Booking cancelled",
                "property_status": property_obj.status
            }
        )


# =========================================
# 📌 LANDLORD ANALYTICS
# =========================================
class LandlordAnalyticsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        properties = user.property_set.all()

        return Response({
            "total_properties":
                properties.count(),

            "available_properties":
                properties.filter(
                    status="available"
                ).count(),

            "occupied_properties":
                properties.filter(
                    status="occupied"
                ).count(),

            "pending_bookings":
                Booking.objects.filter(
                    property__landlord=user,
                    status="pending"
                ).count(),

            "approved_bookings":
                Booking.objects.filter(
                    property__landlord=user,
                    status="approved"
                ).count(),
        })


# =========================================
# 📌 TENANT ANALYTICS
# =========================================
class TenantAnalyticsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        bookings = user.tenant_bookings.all()

        return Response({
            "total_bookings":
                bookings.count(),

            "approved_bookings":
                bookings.filter(
                    status="approved"
                ).count(),

            "pending_bookings":
                bookings.filter(
                    status="pending"
                ).count(),

            "cancelled_bookings":
                bookings.filter(
                    status="cancelled"
                ).count(),
        })