from rest_framework import viewsets, permissions, status
from rest_framework import decorators, response
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
        return Activity.objects.filter(user=self.request.user).order_by('-timestamp')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
