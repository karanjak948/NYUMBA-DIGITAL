from django.urls import path
from .views import ChangePasswordView
from .views import ( RegisterView, CustomLoginView, ProfileView, SuspendUserView,)
from rest_framework_simplejwt.views import ( TokenRefreshView,)
from .views import ( AdminDashboardView, AdminPropertyListView, AdminUserListView, AdminBookingListView,)


urlpatterns = [
    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),

    path(
        "login/",
        CustomLoginView.as_view(),
        name="login",
    ),

    path(
        "login/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    path(
        "admin/dashboard/",
        AdminDashboardView.as_view(),
        name="admin-dashboard"
    ),

    path("admin/dashboard/", AdminDashboardView.as_view()),
    path("admin/properties/", AdminPropertyListView.as_view()),
    path("admin/users/", AdminUserListView.as_view()),
    path("admin/bookings/", AdminBookingListView.as_view()),
    path("suspend-user/<int:user_id>/", SuspendUserView.as_view()),

    path(
        "change-password/",
        ChangePasswordView.as_view(),
    ),

    path(
        "profile/",
        ProfileView.as_view(),
        name="profile",
    ),
]