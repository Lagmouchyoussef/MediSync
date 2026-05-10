from rest_framework import serializers
from api.models import Availability, Appointment

class AvailabilitySerializer(serializers.ModelSerializer):
    """
    Serializer for the Availability model.
    Manages consultation slots.
    """
    class Meta:
        model = Availability
        fields = '__all__'
        read_only_fields = ('doctor',)

class AppointmentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Appointment model.
    Handles invitation and history records.
    """
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('doctor',)
