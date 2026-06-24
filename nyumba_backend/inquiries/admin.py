from django.contrib import admin

from .models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "property",
        "tenant",
        "created_at",
        "replied_at",
    )

    search_fields = (
        "tenant__username",
        "property__title",
    )

    list_filter = (
        "created_at",
        "replied_at",
    )