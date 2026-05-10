from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import Patient, Availability, Appointment, Activity
from ..serializers import (
    PatientSerializer, AvailabilitySerializer, 
    AppointmentSerializer, ActivitySerializer
)

class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Patient.objects.filter(doctor=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)

class AvailabilityViewSet(viewsets.ModelViewSet):
    serializer_class = AvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Availability.objects.filter(doctor=self.request.user)

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(doctor=self.request.user).order_by('date', 'time')

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)

class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Activity.objects.filter(user=self.request.user).order_by('-timestamp')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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
