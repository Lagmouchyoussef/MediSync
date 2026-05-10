from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from api.models import Appointment, Notification, Activity
from ..serializers.appointments import PatientAppointmentSerializer

class PatientAppointmentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PatientAppointmentSerializer

    def get_queryset(self):
        return Appointment.objects.filter(patient_user=self.request.user).order_by('-date', '-time')

    def perform_create(self, serializer):
        appointment = serializer.save(patient_user=self.request.user, status='Pending')
        
        # Ensure a Patient record exists for this doctor
        from api.models import Patient
        Patient.objects.get_or_create(
            doctor=appointment.doctor,
            user=self.request.user,
            defaults={
                'first_name': self.request.user.first_name,
                'last_name': self.request.user.last_name,
                'email': self.request.user.email,
                'status': 'Active'
            }
        )

        # Notify Doctor
        Notification.objects.create(
            user=appointment.doctor,
            title="Nouvelle Demande de Rendez-vous",
            message=f"{self.request.user.get_full_name()} a demandé une consultation pour le {appointment.date}.",
            type="appointment"
        )
        
        Activity.objects.create(
            user=self.request.user,
            action="Demande de consultation",
            details=f"Demande envoyée au Dr. {appointment.doctor.get_full_name()}",
            type="info"
        )

    def update(self, request, *args, **kwargs):
        appointment = self.get_object()
        if appointment.patient_user != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        
        # Patients can only update reason or notes, or cancel
        if 'status' in request.data and request.data['status'] not in ['Cancelled']:
             return Response({"error": "Patients can only cancel appointments"}, status=status.HTTP_400_BAD_REQUEST)
             
        res = super().update(request, *args, **kwargs)
        
        if 'status' in request.data and request.data['status'] == 'Cancelled':
            Notification.objects.create(
                user=appointment.doctor,
                title="Rendez-vous Annulé",
                message=f"{request.user.get_full_name()} a annulé le rendez-vous du {appointment.date}.",
                type="warning"
            )
            
        return res
