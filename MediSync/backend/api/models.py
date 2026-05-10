from django.db import models
from django.contrib.auth.models import User

class Patient(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_patients_list')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_records', null=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, choices=(('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')), blank=True)
    address = models.TextField(blank=True)
    status = models.CharField(max_length=20, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

from django.db.models.signals import post_delete
from django.dispatch import receiver

# @receiver(post_delete, sender=Patient)
# def delete_related_user(sender, instance, **kwargs):
#     # Only delete the linked user account if this patient has no other
#     # Patient records (i.e., they are not a patient of any other doctor).
#     if instance.user and not Patient.objects.filter(user=instance.user).exists():
#         instance.user.delete()

class Availability(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='availabilities')
    day_of_week = models.CharField(max_length=20) # e.g. "Monday"
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.doctor.username} - {self.day_of_week} ({self.start_time})"

    class Meta:
        verbose_name_plural = "Availabilities"

class Appointment(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_appointments')
    patient_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_appointments', null=True, blank=True)
    patient_name = models.CharField(max_length=200) # Simple version for now or link to Patient
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments', null=True, blank=True)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=20, choices=(('Pending', 'Pending'), ('Accepted', 'Accepted'), ('Rejected', 'Rejected'), ('Confirmed', 'Confirmed'), ('Cancelled', 'Cancelled')), default='Pending')
    type = models.CharField(max_length=50, default='Consultation')
    notes = models.TextField(blank=True, null=True)
    initiator_role = models.CharField(max_length=10, choices=(('doctor', 'doctor'), ('patient', 'patient')), default='patient')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Appointment: {self.patient_name} with Dr. {self.doctor.username} ({self.date})"

    class Meta:
        verbose_name_plural = "Appointments"

class Activity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=255)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=50, default='info')
    
    def __str__(self):
        return f"{self.user.username}: {self.action}"

    class Meta:
        verbose_name_plural = "Activities"

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    type = models.CharField(max_length=50, default='info')
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Notifications"

