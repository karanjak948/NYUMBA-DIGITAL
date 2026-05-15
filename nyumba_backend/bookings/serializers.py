from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):

    property_title = serializers.CharField(
        source='property.title',
        read_only=True
    )

    property_location = serializers.CharField(
        source='property.location',
        read_only=True
    )

    tenant_username = serializers.CharField(
        source='tenant.username',
        read_only=True
    )

    landlord_username = serializers.CharField(
        source='property.landlord.username',
        read_only=True
    )

    class Meta:
        model = Booking

        fields = [
            'id',
            'property',
            'property_title',
            'property_location',
            'tenant',
            'tenant_username',
            'landlord_username',
            'booking_fee',
            'status',
        ]

        read_only_fields = ['tenant']