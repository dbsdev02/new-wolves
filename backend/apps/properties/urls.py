from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
# 'amenities' must be registered before the empty-prefix PropertyViewSet:
# PropertyViewSet uses lookup_field='slug', so its detail route is a
# catch-all `^(?P<slug>[^/.]+)/$` that would otherwise match "amenities/"
# as a property slug before AmenityViewSet's own routes are ever reached.
router.register('amenities', views.AmenityViewSet, basename='amenity')
router.register('', views.PropertyViewSet, basename='property')

urlpatterns = [path('', include(router.urls))]
