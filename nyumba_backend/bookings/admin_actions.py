from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from bookings.models import Booking


class ApproveBookingView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        booking_id = request.data.get('booking')

        booking = Booking.objects.get(id=booking_id)
        booking.status = 'approved'
        booking.save()

        return Response({"message": "Booking approved"})