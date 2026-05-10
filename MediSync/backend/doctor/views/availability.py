from rest_framework import viewsets, permissions
from api.models import Availability, Appointment
from ..serializers import AvailabilitySerializer, AppointmentSerializer

class AvailabilityViewSet(viewsets.ModelViewSet):
    """
    Manages the doctor's weekly consultation schedule and availability slots.
    """
    serializer_class = AvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Availability.objects.filter(doctor=self.request.user)

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(doctor=self.request.user).order_by('date', 'time')

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)
