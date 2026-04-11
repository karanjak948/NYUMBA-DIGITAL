from django.db import models
from django.conf import settings
from properties.models import Property

User = settings.AUTH_USER_MODEL

class Inquiry(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    tenant = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message[:20]