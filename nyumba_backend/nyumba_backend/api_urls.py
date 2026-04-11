from django.urls import path, include
from rest_framework.routers import DefaultRouter
from properties.views import PropertyViewSet
from bookings.views import BookingViewSet
from inquiries.views import InquiryViewSet
from payments.views import PaymentViewSet
from properties.views import ReportView
from payments.views import MpesaPaymentView
from payments.views import AdminDashboardView
from bookings.admin_actions import ApproveBookingView


router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'bookings', BookingViewSet)
router.register(r'inquiries', InquiryViewSet, basename='inquiry')
router.register(r'payments', PaymentViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('reports/', ReportView.as_view()),
    path('auth/', include('users.urls')),
    path('mpesa/', MpesaPaymentView.as_view()),
    path('admin/dashboard/', AdminDashboardView.as_view()),
    path('admin/approve-booking/', ApproveBookingView.as_view()),
    path("api/users/", include("users.urls")),
]



