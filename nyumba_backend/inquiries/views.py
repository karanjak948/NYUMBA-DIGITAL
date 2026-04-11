from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Inquiry
from .serializers import InquirySerializer
from properties.models import Property


class InquiryViewSet(viewsets.ModelViewSet):
    serializer_class = InquirySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # 🧑 Tenant → see their own inquiries
        if user.role == 'tenant':
            return Inquiry.objects.filter(tenant=user)

        # 🏠 Landlord → see inquiries for their properties
        elif user.role == 'landlord':
            return Inquiry.objects.filter(property__landlord=user)

        return Inquiry.objects.all()

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user)