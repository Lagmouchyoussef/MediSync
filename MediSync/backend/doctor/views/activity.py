from rest_framework import viewsets, permissions
from api.models import Activity
from ..serializers import ActivitySerializer

class ActivityViewSet(viewsets.ModelViewSet):
    """
    Provides a read-only stream of system activities and events related to the doctor.
    Used for the Activity History dashboard section.
    """
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Activity.objects.all().order_by('-timestamp')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @decorators.action(detail=False, methods=['post'])
    def clear_all(self, request):
        Activity.objects.all().delete()
        return response.Response({'status': 'All activity logs cleared'})
