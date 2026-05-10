from rest_framework import serializers
from api.models import Appointment, Activity, Notification

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()
    patient_user_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('created_at',)

    def get_doctor_name(self, obj):
        if not obj.doctor:
            return "Unknown Doctor"
        return obj.doctor.get_full_name() or obj.doctor.username

    def get_patient_user_name(self, obj):
        if not obj.patient_user:
            return obj.patient_name or "Unknown Patient"
        return obj.patient_user.get_full_name() or obj.patient_user.username

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
