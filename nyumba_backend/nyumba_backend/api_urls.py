from django.urls import path, include
from rest_framework.routers import DefaultRouter

from properties.views import PropertyViewSet, ReportView
from bookings.views import BookingViewSet, ApproveBookingView, CancelBookingView
from inquiries.views import InquiryViewSet
from payments.views import PaymentViewSet, MpesaPaymentView, AdminDashboardView
from bookings.views import ( LandlordAnalyticsView, TenantAnalyticsView,)
from inquiries.views import ( InquiryViewSet, ReplyInquiryView, )

router = DefaultRouter()

# 🔥 REGISTER ROUTES (CLEAN)
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'bookings', BookingViewSet, basename='booking')  # ✅ FIXED
router.register(r'inquiries', InquiryViewSet, basename='inquiry')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [

    # path(
    #     "inquiries/reply/",
    #     ReplyInquiryView.as_view(),
    #     name="reply-inquiry"
    # ),

    path(
        "notifications/",
        include("notifications.urls")
    ),

    path(
        "inquiries/",
        include("inquiries.urls")
    ),

    path(
        'bookings/approve-booking/',
        ApproveBookingView.as_view(),
        name='approve-booking'
    ),

    path(
        'bookings/cancel-booking/',
        CancelBookingView.as_view(),
        name='cancel-booking'
    ),

    path(
        'analytics/landlord/',
        LandlordAnalyticsView.as_view(),
    ),

    path(
        'analytics/tenant/',
        TenantAnalyticsView.as_view(),
    ),

    path('reports/', ReportView.as_view()),
    path('mpesa/', MpesaPaymentView.as_view()),
    path('admin/dashboard/', AdminDashboardView.as_view()),
    path('auth/', include('users.urls')),

    # KEEP ROUTER ABSOLUTELY LAST
    path('', include(router.urls)),
]