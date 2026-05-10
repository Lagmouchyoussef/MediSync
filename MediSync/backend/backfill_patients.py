"""
Backfill script — MediSync
Crée des enregistrements Patient manquants pour tous les utilisateurs ayant role='patient'
qui n'ont pas encore de ligne dans la table api_patient.

Usage (PowerShell):
    Get-Content backfill_patients.py | python manage.py shell
"""
from django.contrib.auth.models import User
from authentication.models import Profile
from api.models import Patient

patients_users = User.objects.filter(profile__role='patient')
doctors = User.objects.filter(profile__role='doctor')

print(f"Doctors found   : {doctors.count()}")
print(f"Patient users   : {patients_users.count()}")
print()

created_count = 0
for patient_user in patients_users:
    for doctor in doctors:
        exists = Patient.objects.filter(user=patient_user, doctor=doctor).exists()
        if not exists:
            Patient.objects.create(
                doctor=doctor,
                user=patient_user,
                first_name=patient_user.first_name or patient_user.username,
                last_name=patient_user.last_name or '',
                email=patient_user.email,
                status='Active',
            )
            created_count += 1
            print(f"  ✅ Created: {patient_user.get_full_name() or patient_user.email}  →  Dr. {doctor.get_full_name() or doctor.username}")
        else:
            print(f"  ⏭  Already exists: {patient_user.email}  →  Dr. {doctor.username}")

print()
print(f"Total created: {created_count}")
print()

# Final verification
print("=== Final Patient Table ===")
for p in Patient.objects.all():
    print(f"  id={p.id} | {p.first_name} {p.last_name} | doctor={p.doctor.username} | user={p.user.username if p.user else None}")
