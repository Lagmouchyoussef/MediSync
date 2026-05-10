import os, django, sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import Client
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

def check_endpoints():
    client = Client()
    
    # 1. Test user
    email = "debug_check@test.com"
    User.objects.filter(email=email).delete()
    user = User.objects.create_user(username=email, email=email, password="password123")
    from authentication.models import Profile
    Profile.objects.create(user=user, role='patient')
    
    token, _ = Token.objects.get_or_create(user=user)
    auth_header = f"Token {token.key}"
    
    endpoints = [
        '/api/user/',
        '/api/profile/',
        '/api/activities/',
        '/api/patient/appointments/',
        '/api/patient/notifications/',
    ]
    
    print("--- Diagnostic Endpoints (Status 500 Hunt) ---")
    for ep in endpoints:
        try:
            response = client.get(ep, HTTP_AUTHORIZATION=auth_header)
            print(f"Endpoint: {ep} | Status: {response.status_code}")
            if response.status_code == 500:
                print(f"  ERROR CONTENT: {response.content[:200]}")
        except Exception as e:
            print(f"Endpoint: {ep} | CRASH: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    check_endpoints()
