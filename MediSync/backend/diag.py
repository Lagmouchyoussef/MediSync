from django.contrib.auth.models import User
from api.models import Patient
from authentication.models import Profile

print("=== USERS ===")
for u in User.objects.all():
    role = u.profile.role if hasattr(u, 'profile') else 'NO PROFILE'
    print(f"  id={u.id} | username={u.username} | email={u.email} | role={role}")

print()
print("=== PATIENTS (api.Patient table) ===")
patients = Patient.objects.all()
if not patients.exists():
    print("  [EMPTY] No records in Patient table!")
else:
    for p in patients:
        print(f"  id={p.id} | name={p.first_name} {p.last_name} | doctor={p.doctor.username} | linked_user={p.user.username if p.user else None}")

print()
print("=== DOCTORS ===")
for u in User.objects.filter(profile__role='doctor'):
    count = Patient.objects.filter(doctor=u).count()
    print(f"  Doctor: {u.username} | Patient count: {count}")
