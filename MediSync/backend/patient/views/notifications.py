from rest_framework import viewsets, permissions, decorators, response
from api.models import Notification
from ..serializers.notifications import PatientNotificationSerializer

class PatientNotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PatientNotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @decorators.action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user, read=False).update(read=True)
        return response.Response({'status': 'notifications marked as read'})
