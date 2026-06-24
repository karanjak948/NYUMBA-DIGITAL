from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import BookingViewSet, ApproveBookingView
from .views import (LandlordAnalyticsView, TenantAnalyticsView,)

router = DefaultRouter()
router.register(r'', BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),

    path(
        'approve-booking/',
        ApproveBookingView.as_view(),
        name='approve-booking'
    ),

    path(
        "analytics/landlord/",
        LandlordAnalyticsView.as_view(),
    ),

    path(
        "analytics/tenant/",
        TenantAnalyticsView.as_view(),
    ),
]