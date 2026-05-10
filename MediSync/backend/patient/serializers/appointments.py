from rest_framework import serializers
from api.models import Appointment

class PatientAppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()
    doctor_specialty = serializers.SerializerMethodField()
    doctor_image = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            'id', 'doctor', 'doctor_name', 'doctor_specialty', 'doctor_image',
            'date', 'time', 'type', 'status', 'notes', 'initiator_role', 'created_at'
        ]
        read_only_fields = ('id', 'doctor_name', 'doctor_specialty', 'doctor_image', 'created_at')

    def get_doctor_name(self, obj):
        if not obj.doctor:
            return "Unknown Doctor"
        return obj.doctor.get_full_name() or obj.doctor.username or "Unknown Doctor"

    def get_doctor_specialty(self, obj):
        try:
            if obj.doctor and hasattr(obj.doctor, 'profile'):
                return obj.doctor.profile.specialty or ""
        except Exception:
            pass
        return ""

    def get_doctor_image(self, obj):
        try:
            request = self.context.get('request')
            if obj.doctor and hasattr(obj.doctor, 'profile') and obj.doctor.profile.image:
                if request:
                    return request.build_absolute_uri(obj.doctor.profile.image.url)
                return obj.doctor.profile.image.url
        except Exception:
            pass
        return None

