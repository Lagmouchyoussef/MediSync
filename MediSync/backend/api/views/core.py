from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from ..models import Patient, Availability, Appointment, Activity, Notification
from ..serializers import (
    PatientSerializer, AvailabilitySerializer, 
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

