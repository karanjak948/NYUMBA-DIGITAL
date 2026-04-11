from rest_framework import viewsets
from .models import Payment
from .serializers import PaymentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from bookings.models import Booking
import random
from rest_framework.permissions import IsAdminUser
from django.db.models import Sum
from properties.models import Property
from payments.models import Payment



class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]


class MpesaPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        booking_id = request.data.get('booking')
        phone = request.data.get('phone_number')

        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=404)

        amount = booking.booking_fee

        transaction_id = f"MPESA{random.randint(10000,99999)}"

        payment = Payment.objects.create(
            booking=booking,
            user=request.user,
            amount=amount,
            phone_number=phone,
            status='success',
            transaction_id=transaction_id
        )

        booking.payment_status = 'paid'
        booking.save()

        if booking.payment_status == 'paid':
            return Response({"error": "Booking already paid"}, status=400)

        
        return Response({
            "message": "Payment successful",
            "transaction_id": transaction_id,
            "amount": amount,
            "booking_status": booking.payment_status
        })
    
class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):

        # 💰 Total income
        total_income = Payment.objects.filter(status='success').aggregate(
            total=Sum('amount')
        )['total'] or 0

        if request.user.role == 'admin':
            payments = Payment.objects.all()

        # 🏠 Properties
        total_properties = Property.objects.count()
        available_properties = Property.objects.filter(status='available').count()
        booked_properties = Property.objects.filter(status='booked').count()

        # 📅 Bookings
        total_bookings = Booking.objects.count()

        # 📊 Occupancy rate
        occupancy_rate = 0
        if total_properties > 0:
            occupancy_rate = (booked_properties / total_properties) * 100

        return Response({
            "total_income": total_income,
            "total_properties": total_properties,
            "available_properties": available_properties,
            "booked_properties": booked_properties,
            "total_bookings": total_bookings,
            "occupancy_rate": round(occupancy_rate, 2)
        })