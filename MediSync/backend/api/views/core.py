from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from ..models import Patient, Availability, Appointment, Activity, Notification
from ..serializers import (
    AppointmentSerializer, ActivitySerializer, NotificationSerializer
)


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        patients_count = Patient.objects.filter(doctor=user).count()
        appointments_count = Appointment.objects.filter(doctor=user).count()
        activities_count = Activity.objects.filter(user=user).count()
        
        return Response({
            'patients_count': patients_count,
            'appointments_count': appointments_count,
            'activities_count': activities_count,
            'recent_appointments': AppointmentSerializer(
                Appointment.objects.filter(doctor=user).order_by('-date')[:5], 
                many=True
            ).data
        })

class NotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        self.get_queryset().update(read=True)
        return Response({'status': 'all notifications marked as read'})

class AppointmentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        role = getattr(user.profile, 'role', 'patient') if hasattr(user, 'profile') else 'patient'
        
        if role == 'doctor':
            return Appointment.objects.filter(doctor=user).order_by('date', 'time')
        else:
            return Appointment.objects.filter(patient_user=user).order_by('date', 'time')

    def perform_create(self, serializer):
        user = self.request.user
        role = getattr(user.profile, 'role', 'patient') if hasattr(user, 'profile') else 'patient'
        
        if role == 'doctor':
            serializer.save(doctor=user)
        else:
            # Patients can create appointments for a specific doctor
            serializer.save(patient_user=user)

class ActivityViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ActivitySerializer

    def get_queryset(self):
        return Activity.objects.filter(user=self.request.user).order_by('-timestamp')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

