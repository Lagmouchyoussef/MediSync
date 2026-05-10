import os, django, sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import Client
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.urls import resolve

def capture_error():
    client = Client()
    email = "debug_check@test.com"
    user, _ = User.objects.get_or_create(username=email, email=email)
    from authentication.models import Profile
    Profile.objects.get_or_create(user=user, role='patient')
    
    token, _ = Token.objects.get_or_create(user=user)
    auth_header = f"Token {token.key}"
    
    ep = '/api/activities/'
    print(f"--- Calling {ep} ---")
    
    # We use client.request to get more info
    try:
        # Force ALLOWED_HOSTS for test client
        from django.conf import settings
        settings.ALLOWED_HOSTS = ['testserver', 'localhost', '127.0.0.1']
        
        response = client.get(ep, HTTP_AUTHORIZATION=auth_header)
        print(f"Status: {response.status_code}")
        if response.status_code == 500:
            # Django test client often suppresses 500 details unless DEBUG=True
            # But let's try to see if there is a traceback in the content
            print(f"Content: {response.content.decode('utf-8', errors='ignore')[:1000]}")
    except Exception as e:
        print(f"CRASH: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    capture_error()
