from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.utils.decorators import method_decorator
from .models import Community
from .serializers import CommunityListSerializer, CommunityDetailSerializer
from apps.users.permissions import IsEditorOrAbove
from config.cache import public_cache_page


EDITOR_ROLES = ['super_admin', 'admin', 'editor', 'marketing']


@method_decorator(public_cache_page(60), name='list')
@method_decorator(public_cache_page(60), name='retrieve')
class CommunityViewSet(viewsets.ModelViewSet):
    queryset = Community.objects.filter(is_active=True)
    lookup_field = 'slug'

    def get_queryset(self):
        qs = Community.objects.all()
        if self.request.user.is_authenticated and self.request.user.role in EDITOR_ROLES:
            return qs
        return qs.filter(is_active=True)

    def get_serializer_class(self):
        return CommunityListSerializer if self.action == 'list' else CommunityDetailSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsEditorOrAbove()]
        return [IsAuthenticatedOrReadOnly()]

    @action(detail=False, methods=['get'])
    @method_decorator(public_cache_page(60))
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True, is_active=True)[:12]
        return Response(CommunityListSerializer(qs, many=True, context={'request': request}).data)
