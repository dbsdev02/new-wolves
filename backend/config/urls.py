from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

from .media_views import cached_serve

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
    path('news/', include('apps.news.urls')),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(api_v1)),
    # Served unconditionally (not gated by DEBUG) — cPanel/Passenger hosting
    # has no separate web server in front serving /media/, so Django has to.
    re_path(r'^media/(?P<path>.*)$', cached_serve, {'document_root': settings.MEDIA_ROOT}),
]
