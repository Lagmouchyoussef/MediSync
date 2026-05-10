from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.models import Appointment, Activity, Notification
from django.utils import timezone
from datetime import timedelta

class PatientDashboardAnalytics(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Stats
        pending_appointments = Appointment.objects.filter(patient_user=user, status='Pending').count()
        total_activities = Activity.objects.filter(user=user).count()
        unread_notifications = Notification.objects.filter(user=user, read=False).count()
        
        # Recent Appointments
        recent_appointments = Appointment.objects.filter(patient_user=user).order_by('-date', '-time')[:5]
        
        # Activity trend (last 7 days)
        last_week = timezone.now() - timedelta(days=7)
        activities = Activity.objects.filter(user=user, timestamp__gte=last_week)
        
        return Response({
            'stats': {
                'pending_appointments': pending_appointments,
                'total_activities': total_activities,
                'unread_notifications': unread_notifications
            },
            'recent_appointments': [
                {
                    'id': a.id,
                    'doctor': a.doctor.get_full_name(),
                    'date': a.date,
                    'time': a.time,
                    'status': a.status
                } for a in recent_appointments
            ]
        })
