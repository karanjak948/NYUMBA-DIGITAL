from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ( InquiryViewSet, ReplyInquiryView, DeleteInquiryView,)

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
        "delete/<int:inquiry_id>/",
        DeleteInquiryView.as_view(),
        name="delete-inquiry"
    ),

    path(
        "",
        include(router.urls)
    ),
]