from rest_framework import serializers
from api.models import Activity

class PatientActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'action', 'details', 'type', 'timestamp']
        read_only_fields = ('timestamp',)
