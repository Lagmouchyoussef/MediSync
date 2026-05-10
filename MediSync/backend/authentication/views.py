from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db import transaction
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import render
from .models import Profile
from .serializers import ProfileSerializer
from api.models import Patient
from api.email_service import BrevoEmailService
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import logging
import traceback
import os

logger = logging.getLogger(__name__)

def log_error(view_name, e):
    log_file = "c:/Users/youss/Desktop/Django Project/MediSync/backend/error_log.txt"
    with open(log_file, "a") as f:
        f.write(f"\n--- ERROR in {view_name} ---\n")
        f.write(str(e))
        f.write("\n")
        f.write(traceback.format_exc())
        f.write("\n--------------------------\n")

class LoginView(APIView):
    authentication_classes = []
    permission_classes = []
    
    def post(self, request):
        try:
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
                image_url = None
                password_last_changed = None
                
                if hasattr(user, 'profile'):
                    role = user.profile.role
                    password_last_changed = user.profile.password_last_changed
                    # Safely get image URL
                    try:
                        if user.profile.image:
                            image_url = request.build_absolute_uri(user.profile.image.url)
                    except Exception as e:
                        logger.error(f"Error getting profile image: {e}")
                        image_url = None
                    
                return Response({
                    'message': 'Login successful',
                    'user': {
                        'email': user.email,
                        'role': role,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'image': image_url,
                        'password_last_changed': password_last_changed
                    },
                    'token': token.key
                })
            else:
                return Response(
                    {'error': 'Invalid password'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        except Exception as e:
            logger.error(f"Login error: {e}")
            return Response(
                {'error': 'An unexpected error occurred during login'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            first_name = request.data.get('first_name', '')
            last_name = request.data.get('last_name', '')
            role = request.data.get('role', 'patient')
            doctor_id = request.data.get('doctor_id')

            if not email or not password:
                return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

            # Vérification email ET username (car username=email)
            if User.objects.filter(email=email).exists() or User.objects.filter(username=email).exists():
                return Response({'error': 'An account with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name
                )

                Profile.objects.create(user=user, role=role)

                if role == 'patient':
                    # Associer aux docteurs
                    if doctor_id:
                        doctors = User.objects.filter(pk=doctor_id, profile__role='doctor')
                        if not doctors.exists():
                            doctors = User.objects.filter(profile__role='doctor')
                    else:
                        doctors = User.objects.filter(profile__role='doctor')

                    for doc in doctors:
                        Patient.objects.get_or_create(
                            user=user,
                            doctor=doc,
                            defaults={
                                'first_name': first_name,
                                'last_name': last_name,
                                'email': email,
                                'status': 'Active'
                            }
                        )


            # Welcome notification via email
            try:
                email_service = BrevoEmailService()
                email_service.notify_welcome_user(user)
            except Exception as e:
                logger.error(f"Failed to send welcome email to {user.email}: {e}")

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

        except Exception as e:
            logger.error(f"--- REGISTRATION ERROR ---")
            traceback.print_exc()
            return Response(
                {'error': f'Internal Server Error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            # Ensure profile exists to avoid crashes
            profile, created = Profile.objects.get_or_create(user=user)
            
            role = profile.role
            password_last_changed = profile.password_last_changed
            phone = profile.phone or ""
            address = profile.address or ""
            specialty = profile.specialty or ""
            image_url = None
            
            try:
                if profile.image:
                    image_url = request.build_absolute_uri(profile.image.url)
            except Exception as e:
                print(f"Error getting profile image: {e}")

            return Response({
                'user': {
                    'email': user.email,
                    'role': role,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'password_last_changed': password_last_changed,
                    'image': image_url,
                    'phone': phone,
                    'address': address,
                    'specialty': specialty
                }
            })
        except Exception as e:
            log_error("CurrentUserView", e)
            import traceback
            traceback.print_exc()
            return Response(
                {'error': 'An error occurred fetching user data'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request):
        profile, created = Profile.objects.get_or_create(user=request.user)
        return Response(ProfileSerializer(profile, context={'request': request}).data)

    def put(self, request):
        profile, created = Profile.objects.get_or_create(user=request.user)
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
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        try:
            with transaction.atomic():
                # Ensure proper logging before deletion
                logger.info(f"Attempting to delete account: {user.email}")
                user.delete()
                logger.info("Account deleted successfully.")
            return Response({'message': 'Account deleted successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            import traceback
            logger.error(f"ACCOUNT DELETION ERROR: {str(e)}")
            traceback.print_exc()
            return Response({'error': f"Server error during deletion: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not user.check_password(current_password):
            return Response({'error': 'The current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        
        if hasattr(user, 'profile'):
            user.profile.password_last_changed = timezone.now()
            user.profile.save()
            
        return Response({'message': 'Password updated successfully'})

