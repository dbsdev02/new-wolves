from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import NewsItem, TickerStat
from .serializers import NewsItemSerializer, TickerStatSerializer
from apps.users.permissions import IsEditorOrAbove

EDITOR_ROLES = ['super_admin', 'admin', 'editor', 'marketing']


class NewsItemViewSet(viewsets.ModelViewSet):
    serializer_class = NewsItemSerializer
    pagination_class = None

    def get_queryset(self):
        qs = NewsItem.objects.all()
        if self.request.user.is_authenticated and self.request.user.role in EDITOR_ROLES:
            return qs
        return qs.filter(is_active=True)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsEditorOrAbove()]
        return [IsAuthenticatedOrReadOnly()]


class TickerStatViewSet(viewsets.ModelViewSet):
    serializer_class = TickerStatSerializer
    pagination_class = None

    def get_queryset(self):
        qs = TickerStat.objects.all()
        if self.request.user.is_authenticated and self.request.user.role in EDITOR_ROLES:
            return qs
        return qs.filter(is_active=True)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsEditorOrAbove()]
        return [IsAuthenticatedOrReadOnly()]
