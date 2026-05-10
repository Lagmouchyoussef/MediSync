from rest_framework import viewsets, permissions, decorators, response
from api.models import Availability, Appointment, Notification, Activity
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
        appointment = serializer.save(doctor=self.request.user)
        # If the doctor creates it, it's like an invitation
        if appointment.patient_user:
            Notification.objects.create(
                user=appointment.patient_user,
                title="Nouvelle Invitation",
                message=f"Le Dr. {self.request.user.get_full_name()} vous a invité à une consultation le {appointment.date} à {appointment.time}.",
                type="appointment"
            )

    def perform_update(self, serializer):
        old_status = self.get_object().status
        appointment = serializer.save()
        new_status = appointment.status
        
        if old_status != new_status and appointment.patient_user:
            title = "Rendez-vous Confirmé" if new_status == 'Confirmed' else "Rendez-vous Annulé"
            message = f"Votre rendez-vous avec le Dr. {self.request.user.get_full_name()} le {appointment.date} a été {new_status.lower()}."
            
            Notification.objects.create(
                user=appointment.patient_user,
                title=title,
                message=message,
                type="appointment"
            )
            
            Activity.objects.create(
                user=appointment.patient_user,
                action=f"Rendez-vous {new_status}",
                details=f"Consultation avec Dr. {self.request.user.get_full_name()}",
                type="success" if new_status == 'Confirmed' else "warning"
            )
