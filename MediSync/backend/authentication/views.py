from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Profile

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Find user by email
        try:
            user_obj = User.objects.get(email=email)
            username = user_obj.username
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Authenticate
        user = authenticate(username=username, password=password)
        
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            role = 'patient'
            if hasattr(user, 'profile'):
                role = user.profile.role
                
            return Response({
                'message': 'Login successful',
                'user': {
                    'email': user.email,
                    'role': role,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'image': request.build_absolute_uri(user.profile.image.url) if hasattr(user, 'profile') and user.profile.image else None
                },
                'token': token.key
            })
        else:
            return Response(
                {'error': 'Invalid password'},
                status=status.HTTP_401_UNAUTHORIZED
            )

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        role = request.data.get('role', 'patient')

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Create User
        user = User.objects.create_user(
            username=email, # Using email as username
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # Create Profile with role
        Profile.objects.create(user=user, role=role)
        
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'message': 'Registration successful',
            'user': {
                'email': user.email,
                'role': role,
                'first_name': first_name,
                'last_name': last_name
            },
            'token': token.key
        }, status=status.HTTP_201_CREATED)

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        role = 'patient'
        password_last_changed = None
        if hasattr(user, 'profile'):
            role = user.profile.role
            password_last_changed = user.profile.password_last_changed
        return Response({
            'user': {
                'email': user.email,
                'role': role,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'password_last_changed': password_last_changed,
                'image': request.build_absolute_uri(user.profile.image.url) if hasattr(user, 'profile') and user.profile.image else None,
                'phone': user.profile.phone if hasattr(user, 'profile') else "",
                'address': user.profile.address if hasattr(user, 'profile') else "",
                'specialty': user.profile.specialty if hasattr(user, 'profile') else ""
            }
        })
