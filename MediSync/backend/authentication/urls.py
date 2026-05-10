from django.urls import path
from .views import LoginView, RegisterView, CurrentUserView, DeleteAccountView, ChangePasswordView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('current-user/', CurrentUserView.as_view(), name='current-user'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete-account'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]
