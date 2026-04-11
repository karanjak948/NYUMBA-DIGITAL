from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Property(models.Model):
    STATUS_CHOICES = (
        ('available', 'Available'),
        ('booked', 'Booked'),
        ('occupied', 'Occupied'),
    )

    landlord = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='available')
    created_at = models.DateTimeField(auto_now_add=True)

    image = models.ImageField(upload_to='property_images/', null=True, blank=True)

    def __str__(self):
        return self.title