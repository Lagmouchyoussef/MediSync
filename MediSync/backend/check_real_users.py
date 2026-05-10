import os, django, sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.test import Client

def check_real_users():
    client = Client()
    users = User.objects.all()[:5]
    print(f"--- Testing {users.count()} real users ---")
    
    for user in users:
        token, _ = Token.objects.get_or_create(user=user)
        auth_header = f"Token {token.key}"
        print(f"\nTesting User: {user.username} (Role: {getattr(user, 'profile', None)})")
        
        endpoints = ['/api/user/', '/api/activities/', '/api/patient/appointments/']
        for ep in endpoints:
            try:
                # Force ALLOWED_HOSTS
                from django.conf import settings
                settings.ALLOWED_HOSTS = ['testserver', 'localhost', '127.0.0.1']
                
                response = client.get(ep, HTTP_AUTHORIZATION=auth_header)
                print(f"  {ep} -> {response.status_code}")
                if response.status_code == 500:
                    print(f"    ERROR: {response.content.decode('utf-8', errors='ignore')[:500]}")
            except Exception as e:
                print(f"  {ep} -> CRASH: {e}")

if __name__ == "__main__":
    check_real_users()
