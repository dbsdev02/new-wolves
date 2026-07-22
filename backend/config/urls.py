from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

api_v1 = [
    path('auth/', include('apps.users.urls')),
    path('properties/', include('apps.properties.urls')),
    path('projects/', include('apps.projects.urls')),
    path('developers/', include('apps.developers.urls')),
    path('communities/', include('apps.communities.urls')),
    path('agents/', include('apps.agents.urls')),
    path('blogs/', include('apps.blogs.urls')),
    path('leads/', include('apps.leads.urls')),
    path('seo/', include('apps.seo.urls')),
    path('settings/', include('apps.settings_app.urls')),
    path('testimonials/', include('apps.testimonials.urls')),
    path('faqs/', include('apps.faqs.urls')),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(api_v1)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
