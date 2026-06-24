from django.urls import path
from .views import ChangePasswordView

from .views import (
    RegisterView,
    CustomLoginView,
    ProfileView,
)

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

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
        "change-password/",
        ChangePasswordView.as_view(),
    ),

    path(
        "profile/",
        ProfileView.as_view(),
        name="profile",
    ),
]