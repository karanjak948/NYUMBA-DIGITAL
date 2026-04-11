from django.contrib import admin
from .models import Booking

class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'tenant', 'property', 'booking_fee', 'payment_status')
    list_filter = ('payment_status',)

admin.site.register(Booking, BookingAdmin)

# Register your models here.
