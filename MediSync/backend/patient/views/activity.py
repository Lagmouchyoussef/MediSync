from rest_framework import viewsets, permissions
from api.models import Activity
from ..serializers.activity import PatientActivitySerializer

class PatientActivityViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PatientActivitySerializer

    def get_queryset(self):
        return Activity.objects.filter(user=self.request.user).order_by('-timestamp')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
