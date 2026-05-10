from django.contrib import admin

from .models import Activity, Appointment, Availability, Notification, Patient


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'doctor', 'status', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'doctor__username')
    list_filter = ('status',)


@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'day_of_week', 'start_time', 'end_time', 'is_active')
    list_filter = ('day_of_week', 'is_active')


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient_name', 'doctor', 'date', 'time', 'status', 'type')
    search_fields = ('patient_name', 'doctor__username', 'status')
    list_filter = ('status', 'type')


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'type', 'timestamp')
    search_fields = ('user__username', 'action', 'type')
    list_filter = ('type',)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'type', 'read', 'created_at')
    search_fields = ('title', 'message', 'user__username')
    list_filter = ('type', 'read')
