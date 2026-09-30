from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .google_reviews import google_reviews

router = DefaultRouter()
router.register('', views.TestimonialViewSet, basename='testimonial')
urlpatterns = [
    path('google-reviews/', google_reviews, name='google-reviews'),
    path('', include(router.urls)),
]
