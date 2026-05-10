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
        appointment = serializer.save(
            patient_user=self.request.user, 
            status='Pending', 
            initiator_role='patient',
            patient_name=self.request.user.get_full_name()
        )
        
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
            title="New Appointment Request",
            message=f"{self.request.user.get_full_name()} has requested a consultation on {appointment.date}.",
            type="appointment"
        )
        
        Activity.objects.create(
            user=self.request.user,
            action="Consultation Request",
            details=f"Request sent to Dr. {appointment.doctor.get_full_name()}",
            type="info"
        )

    def update(self, request, *args, **kwargs):
        appointment = self.get_object()
        if appointment.patient_user != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        
        # Patients can only update notes or cancel
        allowed_fields = {'notes', 'status'}
        for field in request.data:
            if field not in allowed_fields:
                return Response({"error": f"Patients can only update {', '.join(allowed_fields)}"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Allow patient to Accept/Reject/Cancel
        if 'status' in request.data:
            new_status = request.data['status']
            if new_status not in ['Accepted', 'Rejected', 'Cancelled', 'Pending']:
                 return Response({"error": "Invalid status transition for patient"}, status=status.HTTP_400_BAD_REQUEST)
             
        res = super().update(request, *args, **kwargs)
        
        if 'status' in request.data:
            new_status = request.data['status']
            title = ""
            msg = ""
            
            if new_status == 'Cancelled':
                title = "Appointment Cancelled"
                msg = f"{request.user.get_full_name()} cancelled the appointment on {appointment.date}."
            elif new_status == 'Accepted':
                title = "Invitation Accepted"
                msg = f"{request.user.get_full_name()} has accepted your invitation for {appointment.date}."
            elif new_status == 'Rejected':
                title = "Invitation Declined"
                msg = f"{request.user.get_full_name()} has declined your invitation for {appointment.date}."
                
            if title:
                Notification.objects.create(
                    user=appointment.doctor,
                    title=title,
                    message=msg,
                    type="appointment"
                )
                
                Activity.objects.create(
                    user=appointment.doctor,
                    action=title,
                    details=msg,
                    type="info" if new_status == 'Accepted' else "warning"
                )
            
        return res
