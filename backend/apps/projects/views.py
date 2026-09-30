from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.utils.decorators import method_decorator
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project
from .serializers import ProjectListSerializer, ProjectDetailSerializer
from apps.users.permissions import IsEditorOrAbove
from config.cache import public_cache_page


@method_decorator(public_cache_page(60), name='list')
@method_decorator(public_cache_page(60), name='retrieve')
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.select_related('developer', 'community').filter(is_active=True)
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'city', 'developer__slug', 'community__slug']
    search_fields = ['name', 'description', 'address']
    ordering_fields = ['created_at', 'min_price', 'completion_date']

    def get_serializer_class(self):
        return ProjectListSerializer if self.action == 'list' else ProjectDetailSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsEditorOrAbove()]
        return [IsAuthenticatedOrReadOnly()]

    @action(detail=False, methods=['get'])
    @method_decorator(public_cache_page(60))
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True)[:8]
        return Response(ProjectListSerializer(qs, many=True, context={'request': request}).data)
