from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_settings, name='settings'),
    path('update/', views.update_settings, name='settings-update'),
    path('dashboard/', views.dashboard_stats, name='dashboard-stats'),
]
