from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Developer
from .serializers import DeveloperListSerializer, DeveloperDetailSerializer
from apps.users.permissions import IsEditorOrAbove


class DeveloperViewSet(viewsets.ModelViewSet):
    queryset = Developer.objects.filter(is_active=True)
    lookup_field = 'slug'
    filter_backends = []

    def get_serializer_class(self):
        if self.action == 'list':
            return DeveloperListSerializer
        return DeveloperDetailSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsEditorOrAbove()]
        return [IsAuthenticatedOrReadOnly()]

    @action(detail=False, methods=['get'])
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True)[:12]
        return Response(DeveloperListSerializer(qs, many=True, context={'request': request}).data)
