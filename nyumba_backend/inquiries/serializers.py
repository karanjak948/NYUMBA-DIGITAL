from rest_framework import serializers

from .models import Inquiry


class InquirySerializer(serializers.ModelSerializer):

    tenant_username = serializers.CharField(
        source="tenant.username",
        read_only=True
    )

    property_title = serializers.CharField(
        source="property.title",
        read_only=True
    )

    class Meta:

        model = Inquiry

        fields = "__all__"

        read_only_fields = [
            "tenant",
            "landlord_reply",
            "replied_at",
        ]