from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.utils.decorators import method_decorator
from .models import Developer
from .serializers import DeveloperListSerializer, DeveloperDetailSerializer
from apps.users.permissions import IsEditorOrAbove
from config.cache import public_cache_page


EDITOR_ROLES = ['super_admin', 'admin', 'editor', 'marketing']


@method_decorator(public_cache_page(60), name='list')
@method_decorator(public_cache_page(60), name='retrieve')
class DeveloperViewSet(viewsets.ModelViewSet):
    queryset = Developer.objects.filter(is_active=True)
    lookup_field = 'slug'
    filter_backends = []

    def get_queryset(self):
        qs = Developer.objects.all()
        if self.request.user.is_authenticated and self.request.user.role in EDITOR_ROLES:
            return qs
        return qs.filter(is_active=True)

    def get_serializer_class(self):
        if self.action == 'list':
            return DeveloperListSerializer
        return DeveloperDetailSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsEditorOrAbove()]
        return [IsAuthenticatedOrReadOnly()]

    @action(detail=False, methods=['get'])
    @method_decorator(public_cache_page(60))
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True, is_active=True)[:12]
        return Response(DeveloperListSerializer(qs, many=True, context={'request': request}).data)
