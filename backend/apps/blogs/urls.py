from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('categories', views.BlogCategoryViewSet, basename='blog-category')
router.register('tags', views.BlogTagViewSet, basename='blog-tag')
router.register('', views.BlogViewSet, basename='blog')
urlpatterns = [path('', include(router.urls))]
