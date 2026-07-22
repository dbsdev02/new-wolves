from rest_framework import viewsets
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from .models import SEOPage, Redirect
from .serializers import SEOPageSerializer, RedirectSerializer
from apps.users.permissions import IsAdminOrAbove


class SEOPageViewSet(viewsets.ModelViewSet):
    queryset = SEOPage.objects.filter(is_active=True)
    serializer_class = SEOPageSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminOrAbove()]
        return [IsAuthenticatedOrReadOnly()]

    def get_object(self):
        queryset = self.get_queryset()
        lookup = self.kwargs.get(self.lookup_field)
        try:
            return queryset.get(pk=lookup)
        except (SEOPage.DoesNotExist, ValueError):
            return queryset.get(page_identifier=lookup)


class RedirectViewSet(viewsets.ModelViewSet):
    queryset = Redirect.objects.all()
    serializer_class = RedirectSerializer
    permission_classes = [IsAdminOrAbove]

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def active(self, request):
        redirects = Redirect.objects.filter(is_active=True)
        return Response(RedirectSerializer(redirects, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_seo_by_page(request, page_identifier):
    try:
        seo = SEOPage.objects.get(page_identifier=page_identifier, is_active=True)
        return Response(SEOPageSerializer(seo).data)
    except SEOPage.DoesNotExist:
        return Response({})
