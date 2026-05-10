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

    @decorators.action(detail=False, methods=['post'])
    def set_availability(self, request):
        days = request.data.get('days', [])
        start_time = request.data.get('start_time')
        end_time = request.data.get('end_time')
        
        if not days or not start_time or not end_time:
            return response.Response({'error': 'Missing data'}, status=400)
            
        # Delete existing for this doctor to replace
        Availability.objects.filter(doctor=request.user).delete()
        
        created = []
        for day in days:
            obj = Availability.objects.create(
                doctor=request.user,
                day_of_week=day,
                start_time=start_time,
                end_time=end_time
            )
            created.append(obj.id)
            
        return response.Response({'status': f'{len(created)} slots created', 'ids': created})

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(doctor=self.request.user).order_by('date', 'time')

    def perform_create(self, serializer):
        appointment = serializer.save(doctor=self.request.user, initiator_role='doctor')
        
        # Ensure patient_user and patient_name are linked/populated
        if appointment.patient:
            if not appointment.patient_user:
                appointment.patient_user = appointment.patient.user
            if not appointment.patient_name:
                appointment.patient_name = f"{appointment.patient.first_name} {appointment.patient.last_name}"
            appointment.save()
            
        # If the doctor creates it, it's like an invitation
        if appointment.patient_user:
            # Notify via Email
            from api.email_service import BrevoEmailService
            brevo = BrevoEmailService()
            # Use the invitation workflow (Doctor -> Patient)
            brevo.notify_patient_invitation(appointment.patient_user, self.request.user, appointment)

            Notification.objects.create(
                user=appointment.patient_user,
                title="New Invitation",
                message=f"Dr. {self.request.user.get_full_name()} has invited you for a consultation on {appointment.date} at {appointment.time}.",
                type="appointment"
            )

    def perform_update(self, serializer):
        old_status = self.get_object().status
        appointment = serializer.save()
        new_status = appointment.status
        
        if old_status != new_status and appointment.patient_user:
            # Notify via Email
            from api.email_service import BrevoEmailService
            brevo = BrevoEmailService()
            brevo.notify_patient_response(appointment.patient_user, self.request.user, appointment)

            status_map = {
                'Confirmed': 'Confirmed',
                'Cancelled': 'Cancelled',
                'Accepted': 'Accepted',
                'Rejected': 'Rejected'
            }
            status_fr = status_map.get(new_status, new_status)
            
            title = f"Appointment {status_fr}"
            message = f"Your appointment with Dr. {self.request.user.get_full_name()} on {appointment.date} was {status_fr.lower()}."
            
            Notification.objects.create(
                user=appointment.patient_user,
                title=title,
                message=message,
                type="appointment" if new_status == 'Confirmed' else "warning"
            )
            
            Activity.objects.create(
                user=appointment.patient_user,
                action=title,
                details=f"Consultation with Dr. {self.request.user.get_full_name()}",
                type="success" if new_status == 'Confirmed' else "warning"
            )

