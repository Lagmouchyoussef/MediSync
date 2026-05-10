from rest_framework import serializers
from api.models import Appointment

class PatientAppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True)
    doctor_specialty = serializers.CharField(source='doctor.profile.specialty', read_only=True)
    doctor_image = serializers.ImageField(source='doctor.profile.image', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'doctor', 'doctor_name', 'doctor_specialty', 'doctor_image',
            'date', 'time', 'type', 'status', 'notes', 'initiator_role', 'created_at'
        ]
        read_only_fields = ('id', 'doctor', 'doctor_name', 'doctor_specialty', 'doctor_image', 'created_at')
