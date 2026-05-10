from rest_framework import serializers
from api.models import Notification

class PatientNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'type', 'read', 'created_at']
        read_only_fields = ('created_at',)
