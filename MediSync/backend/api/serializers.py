from rest_framework import serializers
from api.models import Appointment, Activity, Notification

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True)
    patient_user_name = serializers.CharField(source='patient_user.get_full_name', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('created_at',)

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'
        read_only_fields = ('user', 'timestamp')

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('user', 'created_at')
