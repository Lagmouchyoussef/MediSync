from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AnalyticsView, PatientViewSet, AvailabilityViewSet, 
    AppointmentViewSet, ActivityViewSet, NotificationViewSet, ProfileView,
    DeleteAccountView, ChangePasswordView
)

# Standardize router for doctor module
router = DefaultRouter()
router.register(r'patients', PatientViewSet, basename='doctor-patients')
router.register(r'availabilities', AvailabilityViewSet, basename='doctor-availabilities')
router.register(r'appointments', AppointmentViewSet, basename='doctor-appointments')
router.register(r'activities', ActivityViewSet, basename='doctor-activities')
router.register(r'notifications', NotificationViewSet, basename='doctor-notifications')

urlpatterns = [
    # Dedicated configuration and analytics endpoints
    path('analytics/', AnalyticsView.as_view(), name='doctor-analytics'),
    path('profile/', ProfileView.as_view(), name='doctor-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='doctor-change-password'),
    path('delete-account/', DeleteAccountView.as_view(), name='doctor-delete-account'),
    
    # Resource endpoints via router
    path('', include(router.urls)),
]
