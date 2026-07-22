from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Blog, BlogCategory, BlogTag, BlogComment
from .serializers import (
    BlogListSerializer, BlogDetailSerializer, BlogWriteSerializer,
    BlogCategorySerializer, BlogTagSerializer, BlogCommentSerializer
)
from apps.users.permissions import IsEditorOrAbove


class BlogViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category__slug', 'status', 'is_featured']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['published_at', 'views_count', 'created_at']

    def get_queryset(self):
        qs = Blog.objects.select_related('author', 'category').prefetch_related('tags')
        if self.request.user.is_authenticated and self.request.user.role in ['super_admin', 'admin', 'editor', 'marketing']:
            return qs
        return qs.filter(status='published')

    def get_serializer_class(self):
        if self.action == 'list':
            return BlogListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return BlogWriteSerializer
        return BlogDetailSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsEditorOrAbove()]
        return super().get_permissions()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        return Response(BlogDetailSerializer(instance, context={'request': request}).data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True, status='published')[:6]
        return Response(BlogListSerializer(qs, many=True, context={'request': request}).data)

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def add_comment(self, request, slug=None):
        blog = self.get_object()
        serializer = BlogCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(blog=blog)
            return Response({'message': 'Comment submitted for review.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def related(self, request, slug=None):
        blog = self.get_object()
        related = Blog.objects.filter(status='published', category=blog.category).exclude(id=blog.id)[:4]
        return Response(BlogListSerializer(related, many=True, context={'request': request}).data)


class BlogCategoryViewSet(viewsets.ModelViewSet):
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsEditorOrAbove()]
        return [IsAuthenticatedOrReadOnly()]


class BlogTagViewSet(viewsets.ModelViewSet):
    queryset = BlogTag.objects.all()
    serializer_class = BlogTagSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsEditorOrAbove()]
        return [IsAuthenticatedOrReadOnly()]
