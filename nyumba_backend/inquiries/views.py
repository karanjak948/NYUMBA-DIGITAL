from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from django.utils import timezone

from .models import Inquiry
from .serializers import InquirySerializer

from notifications.models import Notification


class InquiryViewSet(viewsets.ModelViewSet):

    serializer_class = InquirySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        # Tenant → own inquiries
        if user.role == "tenant":

            return Inquiry.objects.filter(
                tenant=user
            )

        # Landlord → inquiries for their properties
        elif user.role == "landlord":

            return Inquiry.objects.filter(
                property__landlord=user
            )

        return Inquiry.objects.all()

    def perform_create(self, serializer):

        serializer.save(
            tenant=self.request.user
        )


# =========================================
# REPLY TO INQUIRY
# =========================================
class ReplyInquiryView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        inquiry_id = request.data.get(
            "inquiry"
        )

        reply = request.data.get(
            "reply"
        )

        try:

            inquiry = Inquiry.objects.get(
                id=inquiry_id
            )

        except Inquiry.DoesNotExist:

            return Response(
                {
                    "error": "Inquiry not found"
                },
                status=404
            )

        # Only landlords can reply
        if request.user.role != "landlord":

            return Response(
                {
                    "error": "Only landlords can reply"
                },
                status=403
            )

        # Ownership check
        if inquiry.property.landlord != request.user:

            return Response(
                {
                    "error": "Unauthorized"
                },
                status=403
            )

        inquiry.landlord_reply = reply

        inquiry.replied_at = timezone.now()

        inquiry.save()

        # Notify tenant
        Notification.objects.create(
            user=inquiry.tenant,
            message=(
                f"Your inquiry for "
                f"{inquiry.property.title} "
                f"has been answered."
            )
        )

        return Response(
            {
                "message": "Reply sent"
            }
        )
    
class ReplyInquiryView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        print("REPLY VIEW HIT")

        return Response({
            "message": "Reply endpoint working"
        })