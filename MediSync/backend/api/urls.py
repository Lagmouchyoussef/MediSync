from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.health import HealthCheckView
from .views.core import (
    PatientViewSet, AppointmentViewSet, 
    AvailabilityViewSet, ActivityViewSet, DashboardStatsView
)

router = DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'availabilities', AvailabilityViewSet, basename='availability')
router.register(r'activities', ActivityViewSet, basename='activity')

urlpatterns = [
    path('', include('authentication.urls')),
    path('health/', HealthCheckView.as_view(), name='health_check'),
    path('stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('', include(router.urls)),
]