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
        from django.utils import timezone
        today = timezone.now().date()
        
        # Global counts for A to Z management
        patients_count = Patient.objects.all().count()
        # Count only today's appointments for "Today's Appointments"
        appointments_today_count = Appointment.objects.filter(date=today).count()
        # Global activity and notifications
        activities_count = Activity.objects.all().count()
        unread_notifications_count = Notification.objects.filter(read=False).count()
        
        return Response({
            'patients_count': patients_count,
            'appointments_count': appointments_today_count,
            'activities_count': activities_count,
            'unread_notifications_count': unread_notifications_count,
            'recent_appointments': AppointmentSerializer(
                Appointment.objects.all().order_by('-date', '-time')[:5], 
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

