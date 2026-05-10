from rest_framework import serializers
from api.models import Patient

class PatientSerializer(serializers.ModelSerializer):
    """
    Serializer for the Patient model.
    Handles clinical and personal data for patients assigned to a doctor.
    """
    class Meta:
        model = Patient
        fields = '__all__'
        read_only_fields = ('doctor',)
