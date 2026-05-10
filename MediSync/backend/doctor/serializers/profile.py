from rest_framework import serializers
from authentication.models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'first_name', 'last_name', 'email', 'role', 'image', 
            'phone', 'address', 'specialty', 'password_last_changed',
            'notification_settings', 'preferences', 'clinic_name', 'clinic_address'
        ]
        read_only_fields = ('id', 'role', 'password_last_changed')

    def update(self, instance, validated_data):
        # Extract user data
        user_data = validated_data.pop('user', {})
        user = instance.user

        # Update user fields
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        # Update profile fields
        return super().update(instance, validated_data)
