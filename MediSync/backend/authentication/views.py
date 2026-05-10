from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db import transaction
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Profile
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .serializers import ProfileSerializer
from api.models import Patient

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
                        # Log the error but don't fail the login
                        print(f"Error getting profile image: {e}")
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
            print(f"Login error: {e}")
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
            # Optional: doctor_id the patient wants to register with
            doctor_id = request.data.get('doctor_id')

            if User.objects.filter(email=email).exists():
                return Response({'error': 'This account is already created.'}, status=status.HTTP_400_BAD_REQUEST)

            # Create User, Profile, and (if patient) Patient records atomically
            with transaction.atomic():
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name
                )

                # Create Profile with role
                Profile.objects.create(user=user, role=role)

                # If the new user is a patient, create a Patient record
                # so they appear in doctor dashboards immediately.
                if role == 'patient':
                    if doctor_id:
                        # Link to the specific chosen doctor
                        try:
                            doctor_user = User.objects.get(pk=doctor_id, profile__role='doctor')
                            Patient.objects.create(
                                doctor=doctor_user,
                                user=user,
                                first_name=first_name,
                                last_name=last_name,
                                email=email,
                                status='Active',
                            )
                        except User.DoesNotExist:
                            pass  # Invalid doctor_id, skip silently
                    else:
                        # No doctor specified → create for ALL existing doctors
                        # This ensures the patient is visible to everyone.
                        doctors = User.objects.filter(profile__role='doctor')
                        for doctor_user in doctors:
                            # Avoid duplicate if already exists (safety guard)
                            if not Patient.objects.filter(user=user, doctor=doctor_user).exists():
                                Patient.objects.create(
                                    doctor=doctor_user,
                                    user=user,
                                    first_name=first_name,
                                    last_name=last_name,
                                    email=email,
                                    status='Active',
                                )

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
            print(f"Registration error: {e}")
            return Response(
                {'error': 'An unexpected error occurred during registration'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            role = 'patient'
            password_last_changed = None
            image_url = None
            phone = ""
            address = ""
            specialty = ""
            
            if hasattr(user, 'profile'):
                role = user.profile.role
                password_last_changed = user.profile.password_last_changed
                phone = user.profile.phone or ""
                address = user.profile.address or ""
                specialty = user.profile.specialty or ""
                # Safely get image URL
                try:
                    if user.profile.image:
                        image_url = request.build_absolute_uri(user.profile.image.url)
                except Exception as e:
                    print(f"Error getting profile image: {e}")
                    image_url = None
            
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
            print(f"CurrentUser error: {e}")
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
        user.delete()
        return Response({'message': 'Account deleted successfully'}, status=status.HTTP_200_OK)

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
