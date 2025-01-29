"""
URL configuration for app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from django.contrib.admin import action
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from django.contrib import admin
from django.urls import path, include
from main.views import *
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework.schemas import get_schema_view
from rest_framework.schemas.views import SchemaView

router = DefaultRouter()
router.register(r'machines', MachineViewSet, basename='machine')
router.register(r'details', ReferenceViewSet, basename='detail')




urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('main/', include('main.urls')),
    path('api/', include(router.urls)),
    path('api/machines/restricted/<str:id_num>', MachineRestrictedView.as_view()),

    path('api/reclamation/<str:id_>', ReclamationView.as_view()),
    path('api/create/<str:category>', CreateView.as_view()),
    path('api/reclamations', ReclamationsView.as_view()),
    path('api/dashboard/', AuthenticatedView.as_view()),
    path('api/dashboard/<str:category>', SortedView.as_view()),
    path('api/dashboard/<str:category>?sorting=<str:sorting>', SortedView.as_view()),
    path('api/dashboard/<str:category>?sorting=<str:sorting>&filter=<str:filter_>', SortedView.as_view()),
    path('api/auth', AuthView.as_view()),
    path('api/schema/view', SchemaView.as_view(), name='schema'),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
urlpatterns += router.urls
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
