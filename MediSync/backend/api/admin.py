from django.contrib import admin

from .models import Activity, Appointment, Availability, Notification, Patient


class AppointmentInline(admin.TabularInline):
    model = Appointment
    extra = 0
    fields = ('date', 'time', 'status', 'type')
    readonly_fields = ('created_at',)

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'doctor', 'email', 'status', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'doctor__username', 'doctor__first_name', 'doctor__last_name')
    list_filter = ('status', 'created_at', 'doctor')
    inlines = [AppointmentInline]
    list_per_page = 20
    actions = ['send_notification']

    @admin.action(description='Envoyer une notification aux patients sélectionnés')
    def send_notification(self, request, queryset):
        for patient in queryset:
            if patient.user:
                Notification.objects.create(
                    user=patient.user,
                    title="Message de l'administration",
                    message="Un administrateur a envoyé un message groupé.",
                    type="info"
                )
        self.message_user(request, f"Notification envoyée à {queryset.count()} patients.")


@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'day_of_week', 'start_time', 'end_time', 'is_active')
    list_filter = ('day_of_week', 'is_active')


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient_name', 'doctor', 'date', 'time', 'status', 'type')
    list_editable = ('status',)
    search_fields = ('patient_name', 'doctor__username', 'doctor__first_name', 'patient__first_name')
    list_filter = ('status', 'type', 'date', 'doctor')
    date_hierarchy = 'date'
    ordering = ('-date', '-time')


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'type', 'timestamp')
    search_fields = ('user__username', 'action', 'type')
    list_filter = ('type',)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'type', 'read', 'created_at')
    list_editable = ('read',)
    search_fields = ('title', 'message', 'user__username')
    list_filter = ('type', 'read', 'created_at', 'user')
    readonly_fields = ('created_at',)
