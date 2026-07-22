from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('', views.PropertyViewSet, basename='property')
router.register('amenities', views.AmenityViewSet, basename='amenity')

urlpatterns = [path('', include(router.urls))]
