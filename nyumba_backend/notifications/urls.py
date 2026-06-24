from django.urls import path

from .views import (
    NotificationListView,
    MarkNotificationsReadView,
    MarkNotificationReadView,
)

urlpatterns = [

    path(
        "mark-read/",
        MarkNotificationsReadView.as_view()
    ),

    path(
        "",
        NotificationListView.as_view(),
    ),

    path(
        "read/<int:notification_id>/",
        MarkNotificationReadView.as_view(),
        name="mark-read"
    ),

]