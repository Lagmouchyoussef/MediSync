import os, django, sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import Appointment, Activity, Notification, Patient
from authentication.models import Profile

def sanitize_data():
    print("--- Data Sanitization Start ---")
    
    # 1. Profiles
    for user in User.objects.all():
        p, created = Profile.objects.get_or_create(user=user)
        if created:
            print(f"Created missing profile for {user.username}")
    
    # 2. Activity user
    orphaned_activities = Activity.objects.filter(user__isnull=True)
    if orphaned_activities.exists():
        print(f"Found {orphaned_activities.count()} orphaned activities. Deleting...")
        orphaned_activities.delete()

    # 3. Notification user
    orphaned_notifs = Notification.objects.filter(user__isnull=True)
    if orphaned_notifs.exists():
        print(f"Found {orphaned_notifs.count()} orphaned notifications. Deleting...")
        orphaned_notifs.delete()

    # 4. Appointments
    # Check for missing date/time
    for apt in Appointment.objects.all():
        if not apt.date or not apt.time:
            print(f"Fixing Appointment {apt.id} with missing date/time")
            from django.utils import timezone
            apt.date = apt.date or timezone.now().date()
            apt.time = apt.time or timezone.now().time()
            apt.save()

    print("--- Data Sanitization Complete ---")

if __name__ == "__main__":
    sanitize_data()
