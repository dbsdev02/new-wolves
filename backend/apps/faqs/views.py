from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.utils.decorators import method_decorator
from django_filters.rest_framework import DjangoFilterBackend
from .models import FAQ
from .serializers import FAQSerializer
from apps.users.permissions import IsEditorOrAbove
from config.cache import public_cache_page


@method_decorator(public_cache_page(60), name='list')
@method_decorator(public_cache_page(60), name='retrieve')
class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.filter(is_active=True)
    serializer_class = FAQSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']
    pagination_class = None

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsEditorOrAbove()]
        return [IsAuthenticatedOrReadOnly()]
