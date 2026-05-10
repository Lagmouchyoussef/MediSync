from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from authentication.models import Profile
from ..serializers import ProfileSerializer

from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request):
        profile, created = Profile.objects.get_or_create(user=request.user)
        return Response(ProfileSerializer(profile, context={'request': request}).data)

    def put(self, request):
        profile, created = Profile.objects.get_or_create(user=request.user)
        # Use Partial=True for both image and data updates
        serializer = ProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        profile, created = Profile.objects.get_or_create(user=request.user)
        if profile.image:
            profile.image.delete(save=False)
            profile.image = None
            profile.save()
            return Response({'message': 'Profile image deleted'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'No profile image to delete'}, status=status.HTTP_400_BAD_REQUEST)

class DeleteAccountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        try:
            from django.db import transaction
            with transaction.atomic():
                user.delete()
            return Response({'message': 'Account deleted successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not user.check_password(current_password):
            return Response({'error': 'Le mot de passe actuel est incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        
        if hasattr(user, 'profile'):
            user.profile.password_last_changed = timezone.now()
            user.profile.save()
            
        return Response({'message': 'Mot de passe mis à jour avec succès'})
