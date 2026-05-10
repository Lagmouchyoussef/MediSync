from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import Patient, Availability, Appointment, Activity
from ..serializers import (
    PatientSerializer, AvailabilitySerializer, 
    AppointmentSerializer, ActivitySerializer
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
