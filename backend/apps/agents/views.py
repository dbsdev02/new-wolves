from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from django.utils.decorators import method_decorator
from .models import Agent, AgentReview
from .serializers import AgentListSerializer, AgentDetailSerializer, AgentReviewSerializer
from apps.users.permissions import IsEditorOrAbove
from config.cache import public_cache_page


EDITOR_ROLES = ['super_admin', 'admin', 'editor', 'marketing']


@method_decorator(public_cache_page(60), name='list')
@method_decorator(public_cache_page(60), name='retrieve')
class AgentViewSet(viewsets.ModelViewSet):
    queryset = Agent.objects.filter(is_active=True)
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Agent.objects.all()
        if self.request.user.is_authenticated and self.request.user.role in EDITOR_ROLES:
            return qs
        return qs.filter(is_active=True)

    def get_serializer_class(self):
        return AgentListSerializer if self.action == 'list' else AgentDetailSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsEditorOrAbove()]
        return super().get_permissions()

    @action(detail=False, methods=['get'])
    @method_decorator(public_cache_page(60))
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True, is_active=True)[:8]
        return Response(AgentListSerializer(qs, many=True, context={'request': request}).data)

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def add_review(self, request, pk=None):
        agent = self.get_object()
        serializer = AgentReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(agent=agent)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
