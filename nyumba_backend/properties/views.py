from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response

from django.db.models import Sum

from .models import Property
from .serializers import PropertySerializer

from users.permissions import IsLandlord
from bookings.models import Booking


class PropertyViewSet(viewsets.ModelViewSet):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    # 🔥 SMART FILTERING + ROLE CONTROL
    def get_queryset(self):
        user = self.request.user
        queryset = Property.objects.all()

        # 📍 Location filtering (Geo)
        lat = self.request.query_params.get('lat')
        lng = self.request.query_params.get('lng')
        radius = self.request.query_params.get('radius')

        if lat and lng and radius:
            lat = float(lat)
            lng = float(lng)

            queryset = queryset.filter(
                latitude__gte=lat - 0.1,
                latitude__lte=lat + 0.1,
                longitude__gte=lng - 0.1,
                longitude__lte=lng + 0.1
            )

        # 🔐 Role-based filtering (SAFE VERSION)
        if user.is_authenticated:
            if user.role == 'admin':
                pass  # full access

            elif user.role == 'landlord':
                queryset = queryset.filter(landlord=user)

            elif user.role == 'tenant':
                queryset = queryset.filter(status='available')
        else:
            # 🔥 Anonymous users → only see available
            queryset = queryset.filter(status='available')

        # 🔍 Filters
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        location = self.request.query_params.get('location')
        search = self.request.query_params.get('search')

        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        if location:
            queryset = queryset.filter(location__icontains=location)

        if search:
            queryset = queryset.filter(title__icontains=search)

        # 🔽 Sorting
        ordering = self.request.query_params.get('ordering')

        if ordering == 'price_low':
            queryset = queryset.order_by('price')

        elif ordering == 'price_high':
            queryset = queryset.order_by('-price')

        return queryset

    # 🔥 AUTO ASSIGN LANDLORD
    def perform_create(self, serializer):
        serializer.save(landlord=self.request.user)

    # 🔥 ROLE-BASED PERMISSIONS (FIXED CLEAN VERSION)
    def get_permissions(self):
        user = self.request.user

        # 🔓 Public access for listing
        if self.action in ['list', 'retrieve']:
            return []

        # 🔐 Not logged in → block other actions
        if not user.is_authenticated:
            return [IsAuthenticated()]

        # 👑 Admin override
        if hasattr(user, 'role') and user.role == 'admin':
            return [IsAdminUser()]

        # 🏠 Landlord can create
        if self.action == 'create':
            return [IsAuthenticated(), IsLandlord()]

        return [IsAuthenticated()]


# 📊 REPORT VIEW
class ReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # 🏠 Landlord → only their properties
        if user.role == 'landlord':
            properties = Property.objects.filter(landlord=user)
            bookings = Booking.objects.filter(property__landlord=user)

        # 🧑 Admin or others → all data
        else:
            properties = Property.objects.all()
            bookings = Booking.objects.all()

        total_properties = properties.count()
        available = properties.filter(status='available').count()
        booked = properties.filter(status='booked').count()

        # 💰 Total income
        total_income = bookings.aggregate(total=Sum('booking_fee'))['total'] or 0

        # 📊 Occupancy rate
        occupancy_rate = 0
        if total_properties > 0:
            occupancy_rate = (booked / total_properties) * 100

        data = {
            "total_properties": total_properties,
            "available_properties": available,
            "booked_properties": booked,
            "occupancy_rate": round(occupancy_rate, 2),
            "total_income": total_income
        }

        return Response(data)