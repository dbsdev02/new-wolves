from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('pages', views.SEOPageViewSet, basename='seo-page')
router.register('redirects', views.RedirectViewSet, basename='redirect')

urlpatterns = [
    path('', include(router.urls)),
    path('page/<str:page_identifier>/', views.get_seo_by_page, name='seo-by-page'),
]
