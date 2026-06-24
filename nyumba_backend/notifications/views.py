from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.views import APIView
from rest_framework.response import Response


class NotificationListView(
    generics.ListAPIView
):

    serializer_class = (
        NotificationSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        return Notification.objects.filter(
            user=self.request.user
        )
    
class MarkNotificationsReadView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(
            is_read=True
        )

        return Response({
            "message": "Notifications marked as read"
        })


class MarkNotificationReadView(APIView):

    permission_classes = [IsAuthenticated]

    def post(
        self,
        request,
        notification_id
    ):

        try:

            notification = (
                Notification.objects.get(
                    id=notification_id,
                    user=request.user
                )
            )

        except Notification.DoesNotExist:

            return Response(
                {
                    "error":
                    "Notification not found"
                },
                status=404
            )

        notification.is_read = True

        notification.save()

        return Response({
            "message":
            "Notification marked as read"
        })