from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='patient')
    image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    specialty = models.CharField(max_length=100, blank=True)
    password_last_changed = models.DateTimeField(null=True, blank=True)
    
    # New settings fields
    notification_settings = models.JSONField(default=dict, blank=True)
    preferences = models.JSONField(default=dict, blank=True)
    clinic_name = models.CharField(max_length=200, blank=True)
    clinic_address = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"

from django.db.models.signals import post_delete
from django.dispatch import receiver
import os

@receiver(post_delete, sender=Profile)
def delete_profile_image(sender, instance, **kwargs):
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)
