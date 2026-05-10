from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.contrib.auth.models import User
from authentication.models import Profile

class DoctorListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Filter users who are doctors
        doctors = User.objects.filter(profile__role='doctor')
        data = []
        for doc in doctors:
            data.append({
                'id': doc.id,
                'name': doc.get_full_name() or doc.username,
                'specialty': getattr(doc.profile, 'specialty', 'Médecin Généraliste'),
                'image': doc.profile.image.url if doc.profile.image else None
            })
        return Response(data)
