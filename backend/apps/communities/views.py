from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Community
from .serializers import CommunityListSerializer, CommunityDetailSerializer
from apps.users.permissions import IsEditorOrAbove


class CommunityViewSet(viewsets.ModelViewSet):
    queryset = Community.objects.filter(is_active=True)
    lookup_field = 'slug'

    def get_serializer_class(self):
        return CommunityListSerializer if self.action == 'list' else CommunityDetailSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsEditorOrAbove()]
        return [IsAuthenticatedOrReadOnly()]

    @action(detail=False, methods=['get'])
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True)[:12]
        return Response(CommunityListSerializer(qs, many=True, context={'request': request}).data)
