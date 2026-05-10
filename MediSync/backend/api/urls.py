from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.health import HealthCheckView
from .views.core import (
    DashboardStatsView, NotificationViewSet, AppointmentViewSet, ActivityViewSet
)

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'activities', ActivityViewSet, basename='activity')

# Clinical routes moved to doctor app

urlpatterns = [
    path('', include('authentication.urls')),
    path('health/', HealthCheckView.as_view(), name='health_check'),
    path('stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('', include(router.urls)),
]