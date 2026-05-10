from django.urls import path
from .views import LoginView, RegisterView, DeleteAccountView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete-account'),
]
