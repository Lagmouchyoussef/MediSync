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
        return Activity.objects.all().order_by('-timestamp')

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except Exception as e:
            # Handle cases where activity doesn't exist or doesn't belong to user
            return response.Response(
                {'error': 'Activity not found or access denied'},
                status=status.HTTP_404_NOT_FOUND
            )
