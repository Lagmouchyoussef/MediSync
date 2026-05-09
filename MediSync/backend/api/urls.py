from django.urls import path, include
from .views.health import HealthCheckView

urlpatterns = [
    # Forward auth requests to the new authentication app
    path('', include('authentication.urls')),
    path('health/', HealthCheckView.as_view(), name='health_check'),
]