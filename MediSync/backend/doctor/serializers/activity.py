from rest_framework import serializers
from api.models import Activity

class ActivitySerializer(serializers.ModelSerializer):
    """
    Serializer for the Activity model.
    Tracks system-wide actions performed by the user.
    """
    class Meta:
        model = Activity
        fields = '__all__'
        read_only_fields = ('user',)
