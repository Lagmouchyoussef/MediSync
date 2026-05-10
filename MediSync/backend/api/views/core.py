from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from ..models import Patient, Availability, Appointment, Activity, Notification
from ..serializers import (
    AppointmentSerializer, ActivitySerializer, NotificationSerializer
)
from django.shortcuts import render
from django.utils import timezone
import logging
import traceback

logger = logging.getLogger(__name__)

def log_error(view_name, e):
    log_file = "c:/Users/youss/Desktop/Django Project/MediSync/backend/error_log.txt"
    with open(log_file, "a") as f:
        f.write(f"\n--- ERROR in {view_name} ---\n")
        f.write(str(e))
        f.write("\n")
        f.write(traceback.format_exc())
        f.write("\n--------------------------\n")


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        
        patients_count = Patient.objects.all().count()
        appointments_today_count = Appointment.objects.filter(date=today).count()
        activities_count = Activity.objects.all().count()
        unread_notifications_count = Notification.objects.filter(read=False).count()
        recent_appointments = Appointment.objects.all().order_by('-date', '-time')[:10]

        # Last 7 days data for charts
        from datetime import timedelta
        labels = []
        chart_data_points = []
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            labels.append(day.strftime('%a'))
            chart_data_points.append(Appointment.objects.filter(date=day).count())

        data = {
            'patients_count': patients_count,
            'appointments_count': appointments_today_count,
            'activities_count': activities_count,
            'unread_notifications_count': unread_notifications_count,
            'recent_appointments': [
                {
                    'patient_name': a.patient_name or "Unknown Patient",
                    'doctor_name': (a.doctor.get_full_name() if a.doctor else "") or (a.doctor.username if a.doctor else "Unknown Doctor"),
                    'date': str(a.date),
                    'time': str(a.time),
                    'status': a.status
                } for a in recent_appointments
            ],
            'chart_labels': labels,
            'chart_data': chart_data_points
        }

        if 'text/html' in request.accepted_renderer.media_type:
            return render(request, 'admin/dashboard.html', data)
            
        return Response(data)

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
        try:
            return Activity.objects.filter(user=self.request.user).order_by('-timestamp')
        except Exception as e:
            log_error("ActivityViewSet", e)
            raise e

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

