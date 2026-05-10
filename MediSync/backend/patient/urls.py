from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PatientAppointmentViewSet, PatientActivityViewSet, 
    PatientNotificationViewSet, PatientDashboardAnalytics,
    DoctorListView
)

router = DefaultRouter()
router.register(r'appointments', PatientAppointmentViewSet, basename='patient-appointments')
router.register(r'activities', PatientActivityViewSet, basename='patient-activities')
router.register(r'notifications', PatientNotificationViewSet, basename='patient-notifications')

urlpatterns = [
    path('', include(router.urls)),
    path('analytics/', PatientDashboardAnalytics.as_view(), name='patient-analytics'),
    path('doctors/', DoctorListView.as_view(), name='patient-doctors'),
]
