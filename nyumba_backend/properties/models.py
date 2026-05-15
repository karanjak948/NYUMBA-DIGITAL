from django.db import models
from django.conf import settings


User = settings.AUTH_USER_MODEL


class Property(models.Model):

    STATUS_CHOICES = (
        ("available", "Available"),
        ("booked", "Booked"),
        ("occupied", "Occupied"),
    )

    PROPERTY_TYPE_CHOICES = (
        ("bedsitter", "Bedsitter"),
        ("1br", "1 Bedroom"),
        ("2br", "2 Bedroom"),
        ("3br", "3 Bedroom"),
    )

    landlord = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    property_type = models.CharField(
        max_length=20,
        choices=PROPERTY_TYPE_CHOICES
    )

    title = models.CharField(
        max_length=100
    )

    description = models.TextField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    location = models.CharField(
        max_length=100
    )

    latitude = models.FloatField()

    longitude = models.FloatField()

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="available"
    )

    image = models.ImageField(
        upload_to="property_images/",
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        return f"{self.title} ({self.location})"