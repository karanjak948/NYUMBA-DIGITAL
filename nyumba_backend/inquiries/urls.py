from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    InquiryViewSet,
    ReplyInquiryView,
)

router = DefaultRouter()

router.register(
    r"",
    InquiryViewSet,
    basename="inquiry"
)

urlpatterns = [

    path(
        "reply/",
        ReplyInquiryView.as_view(),
        name="reply-inquiry"
    ),

    path(
        "",
        include(router.urls)
    ),
]