from rest_framework import viewsets, permissions
from api.models import Patient
from ..serializers import PatientSerializer

class PatientViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows doctors to manage their patient records.
    Filters patients to only show those assigned to the authenticated doctor.
    """
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Patient.objects.filter(doctor=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)
