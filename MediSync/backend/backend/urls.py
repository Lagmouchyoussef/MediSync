"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/doctor/', include('doctor.urls')),
    path('api/patient/', include('patient.urls')),
    path('api/', include('api.urls')),
]

# En production, on sert le frontend React via Django
if not settings.DEBUG:
    urlpatterns += [
        path('', TemplateView.as_view(template_name='index.html')),
        path('<path:resource>', TemplateView.as_view(template_name='index.html')),
    ]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Admin Site Customization
admin.site.site_header = "MediSync Administration"
admin.site.site_title = "MediSync Admin Portal"
admin.site.index_title = "Welcome to the MediSync Management System"
