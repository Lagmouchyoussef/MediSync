from rest_framework import viewsets, permissions, status, serializers
from rest_framework.response import Response
from django.contrib.auth.models import User
from authentication.models import Profile
from api.models import Patient
from ..serializers import PatientSerializer

class PatientViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows doctors to manage their patient records.
    Returns only patients assigned to the authenticated doctor.
    """
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Patient.objects.filter(doctor=self.request.user).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = []
        for patient in queryset:
            user = patient.user
            data.append({
                'id': patient.id,
                'first_name': patient.first_name or (user.username if user else ''),
                'last_name': patient.last_name or '',
                'email': patient.email or (user.email if user else ''),
                'phone': patient.phone or (user.profile.phone if user and hasattr(user, 'profile') else ''),
                'address': patient.address or (user.profile.address if user and hasattr(user, 'profile') else ''),
                'date_of_birth': patient.date_of_birth,
                'gender': patient.gender or 'Other',
                'status': patient.status,
                'is_linked': user is not None,
                'username': user.username if user else '',
                'date': patient.created_at,
            })
        return Response(data)

    def perform_destroy(self, instance):
        instance.delete()

    def perform_create(self, serializer):
        username = self.request.data.get('username')
        password = self.request.data.get('password')
        email = self.request.data.get('email')
        first_name = self.request.data.get('first_name', '')
        last_name = self.request.data.get('last_name', '')

        user = None
        if username and password:
            if User.objects.filter(username=username).exists():
                raise serializers.ValidationError({'username': 'Ce nom d’utilisateur existe déjà.'})
            if email and User.objects.filter(email=email).exists():
                raise serializers.ValidationError({'email': 'Cet email est déjà utilisé.'})

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )
            Profile.objects.create(user=user, role='patient')

        serializer.save(doctor=self.request.user, user=user)

    def perform_update(self, serializer):
        patient = serializer.instance
        user = patient.user
        username = self.request.data.get('username')
        password = self.request.data.get('password')
        email = self.request.data.get('email')
        first_name = self.request.data.get('first_name')
        last_name = self.request.data.get('last_name')

        if not user and username and password:
            if User.objects.filter(username=username).exists():
                raise serializers.ValidationError({'username': 'Ce nom d’utilisateur existe déjà.'})
            if email and User.objects.filter(email=email).exists():
                raise serializers.ValidationError({'email': 'Cet email est déjà utilisé.'})

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name or '',
                last_name=last_name or '',
            )
            Profile.objects.create(user=user, role='patient')
            serializer.save(user=user)
            return

        if user and username and user.username != username:
            if User.objects.filter(username=username).exclude(pk=user.pk).exists():
                raise serializers.ValidationError({'username': 'Ce nom d’utilisateur existe déjà.'})
            user.username = username

        if user and password:
            user.set_password(password)

        if user:
            if email is not None:
                user.email = email
            if first_name is not None:
                user.first_name = first_name
            if last_name is not None:
                user.last_name = last_name
            user.save()

        serializer.save()
