from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('items', views.NewsItemViewSet, basename='news-item')
router.register('stats', views.TickerStatViewSet, basename='ticker-stat')

urlpatterns = [path('', include(router.urls))]
