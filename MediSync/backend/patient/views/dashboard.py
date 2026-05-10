from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from api.models import Appointment, Activity, Notification
from django.utils import timezone
from datetime import timedelta
import traceback

class PatientDashboardAnalytics(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user

            pending_appointments = Appointment.objects.filter(patient_user=user, status='Pending').count()
            total_activities = Activity.objects.filter(user=user).count()
            unread_notifications = Notification.objects.filter(user=user, read=False).count()

            recent_appointments = Appointment.objects.filter(patient_user=user).order_by('-date', '-time')[:5]

            def safe_doctor_name(appt):
                if not appt.doctor:
                    return "Unknown Doctor"
                return appt.doctor.get_full_name() or appt.doctor.username or "Unknown Doctor"

            return Response({
                'stats': {
                    'pending_appointments': pending_appointments,
                    'total_activities': total_activities,
                    'unread_notifications': unread_notifications
                },
                'recent_appointments': [
                    {
                        'id': a.id,
                        'doctor': safe_doctor_name(a),
                        'date': str(a.date),
                        'time': str(a.time),
                        'status': a.status
                    } for a in recent_appointments
                ]
            })
        except Exception as e:
            traceback.print_exc()
            return Response(
                {'error': f'Dashboard error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
