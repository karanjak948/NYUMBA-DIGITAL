from django.db.models import Sum

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import (
    IsAuthenticated,
    IsAdminUser,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Property
from .serializers import PropertySerializer

from users.permissions import IsLandlord

from bookings.models import Booking


class PropertyViewSet(viewsets.ModelViewSet):

    serializer_class = PropertySerializer

    permission_classes = [IsAuthenticated]

    # Base queryset required by router
    queryset = Property.objects.all()

    # =========================================
    # MARK PROPERTY VACANT
    # =========================================
    @action(detail=True, methods=["post"])
    def mark_vacant(self, request, pk=None):

        property_obj = self.get_object()

        Booking.objects.filter(
            property=property_obj,
            status="approved"
        ).update(
            status="cancelled"
        )
        approved_booking = Booking.objects.filter(
            property=property_obj,
            status="approved"
        ).first()

        if approved_booking:

            Notification.objects.create(
                user=approved_booking.tenant,
                message=(
                    f"{property_obj.title} "
                    f"is no longer assigned to you."
                )
            )

            approved_booking.status = "cancelled"
            approved_booking.save()

        property_obj.status = "available"

        property_obj.save()

        return Response({
            "message":
            "Property marked vacant"
        })

    # =========================================
    # MARK PROPERTY OCCUPIED
    # =========================================
    @action(detail=True, methods=["post"])
    def mark_occupied(self, request, pk=None):

        property = self.get_object()

        property.status = "occupied"

        property.save()

        return Response({
            "message":
            "Property marked as occupied"
        })

    # =========================================
    # FILTERING + ROLE CONTROL
    # =========================================
    def get_queryset(self):

        user = self.request.user

        queryset = super().get_queryset()

        # -------------------------------------
        # GEO FILTERING
        # -------------------------------------
        lat = self.request.query_params.get(
            "lat"
        )

        lng = self.request.query_params.get(
            "lng"
        )

        if lat and lng:

            lat = float(lat)

            lng = float(lng)

            queryset = queryset.filter(
                latitude__gte=lat - 0.1,
                latitude__lte=lat + 0.1,
                longitude__gte=lng - 0.1,
                longitude__lte=lng + 0.1,
            )

        # -------------------------------------
        # ROLE FILTERING
        # -------------------------------------
        if user.is_authenticated:

            if user.role == "landlord":

                queryset = queryset.filter(
                    landlord=user
                )

            elif user.role == "tenant":

                queryset = queryset.filter(
                    status="available"
                )

        else:

            queryset = queryset.filter(
                status="available"
            )

        # -------------------------------------
        # SEARCH + FILTERS
        # -------------------------------------
        min_price = (
            self.request.query_params.get(
                "min_price"
            )
        )

        max_price = (
            self.request.query_params.get(
                "max_price"
            )
        )

        location = (
            self.request.query_params.get(
                "location"
            )
        )

        search = (
            self.request.query_params.get(
                "search"
            )
        )

        if min_price:

            queryset = queryset.filter(
                price__gte=min_price
            )

        if max_price:

            queryset = queryset.filter(
                price__lte=max_price
            )

        if location:

            queryset = queryset.filter(
                location__icontains=location
            )

        if search:

            queryset = queryset.filter(
                title__icontains=search
            )

        # -------------------------------------
        # SORTING
        # -------------------------------------
        ordering = (
            self.request.query_params.get(
                "ordering"
            )
        )

        if ordering == "price_low":

            queryset = queryset.order_by(
                "price"
            )

        elif ordering == "price_high":

            queryset = queryset.order_by(
                "-price"
            )

        return queryset

    # =========================================
    # AUTO ASSIGN LANDLORD
    # =========================================
    def perform_create(self, serializer):

        serializer.save(
            landlord=self.request.user
        )

    # =========================================
    # PERMISSIONS
    # =========================================
    def get_permissions(self):

        user = self.request.user

        # Public endpoints
        if self.action in [
            "list",
            "retrieve",
        ]:
            return []

        # Require auth
        if not user.is_authenticated:
            return [IsAuthenticated()]

        # Admin permissions
        if (
            hasattr(user, "role")
            and user.role == "admin"
        ):
            return [IsAdminUser()]

        # Landlord create
        if self.action == "create":
            return [
                IsAuthenticated(),
                IsLandlord(),
            ]

        return [IsAuthenticated()]


# =========================================
# REPORT VIEW
# =========================================
class ReportView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "landlord":

            return Response(
                {
                    "error":
                    "Only landlords can access reports"
                },
                status=403
            )

        user = request.user

        properties = Property.objects.filter(
            landlord=user
        )

        bookings = Booking.objects.filter(
            property__landlord=user
        )

        total_properties = properties.count()

        available = properties.filter(
            status="available"
        ).count()

        occupied_properties = properties.filter(
            status__in=[
                "booked",
                "occupied"
            ]
        ).count()

        rental_income = properties.filter(
            status__in=[
                "booked",
                "occupied"
            ]
        ).aggregate(
            total=Sum("price")
        )["total"] or 0

        booking_income = bookings.filter(
            status="approved"
        ).aggregate(
            total=Sum("booking_fee")
        )["total"] or 0

        monthly_income = rental_income

        total_income = (
            rental_income +
            booking_income
        )

        occupancy_rate = 0

        if total_properties > 0:

            occupancy_rate = (
                occupied_properties /
                total_properties
            ) * 100

        return Response({

            "total_properties":
                total_properties,

            "available_properties":
                available,

            "occupied_properties":
                occupied_properties,

            "occupancy_rate":
                round(
                    occupancy_rate,
                    2
                ),

            "rental_income":
                rental_income,

            "booking_income":
                booking_income,

            "monthly_income":
                monthly_income,

            "total_income":
                total_income,
        })