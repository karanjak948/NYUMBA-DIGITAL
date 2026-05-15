from django.db import models
from django.conf import settings

from properties.models import Property


User = settings.AUTH_USER_MODEL


class Booking(models.Model):

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("cancelled", "Cancelled"),
    )

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="bookings"
    )

    tenant = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="tenant_bookings"
    )

    booking_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    payment_status = models.CharField(
        max_length=20,
        default="pending"
    )

    booking_date = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-booking_date"]

    def __str__(self):
        return f"{self.property.title} - {self.tenant.username}"