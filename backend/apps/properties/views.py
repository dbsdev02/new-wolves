from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Property, PropertyImage, FloorPlan, PaymentPlan, Amenity
from .serializers import (
    PropertyListSerializer, PropertyDetailSerializer,
    PropertyWriteSerializer, PropertyImageSerializer,
    FloorPlanSerializer, PaymentPlanSerializer, AmenitySerializer
)
from .filters import PropertyFilter
from apps.users.permissions import IsEditorOrAbove


class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.select_related(
        'community', 'developer', 'project', 'agent'
    ).prefetch_related('images', 'amenities').filter(status='published')
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = PropertyFilter
    search_fields = ['title', 'description', 'address', 'reference_number', 'community__name']
    ordering_fields = ['price', 'created_at', 'area_sqft', 'views_count']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_queryset(self):
        qs = Property.objects.select_related('community', 'developer', 'project', 'agent').prefetch_related('images', 'amenities')
        if self.request.user.is_authenticated and self.request.user.role in ['super_admin', 'admin', 'editor', 'marketing']:
            return qs
        return qs.filter(status='published')

    def get_serializer_class(self):
        if self.action == 'list':
            return PropertyListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return PropertyWriteSerializer
        return PropertyDetailSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsEditorOrAbove()]
        return super().get_permissions()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True, status='published')[:8]
        return Response(PropertyListSerializer(qs, many=True, context={'request': request}).data)

    @action(detail=False, methods=['get'])
    def hot(self, request):
        qs = self.get_queryset().filter(is_hot=True, status='published')[:8]
        return Response(PropertyListSerializer(qs, many=True, context={'request': request}).data)

    @action(detail=False, methods=['get'])
    def luxury(self, request):
        qs = self.get_queryset().filter(is_luxury=True, status='published')[:8]
        return Response(PropertyListSerializer(qs, many=True, context={'request': request}).data)

    @action(detail=True, methods=['get'])
    def similar(self, request, slug=None):
        prop = self.get_object()
        similar = Property.objects.filter(
            status='published',
            property_type=prop.property_type,
            purpose=prop.purpose,
        ).exclude(id=prop.id)[:6]
        return Response(PropertyListSerializer(similar, many=True, context={'request': request}).data)

    @action(detail=True, methods=['post'], permission_classes=[IsEditorOrAbove])
    def upload_images(self, request, slug=None):
        prop = self.get_object()
        images = request.FILES.getlist('images')
        created = []
        for img in images:
            pi = PropertyImage.objects.create(property=prop, image=img)
            created.append(PropertyImageSerializer(pi, context={'request': request}).data)
        return Response(created, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path='images/(?P<image_id>[^/.]+)', permission_classes=[IsEditorOrAbove])
    def delete_image(self, request, slug=None, image_id=None):
        prop = self.get_object()
        deleted, _ = PropertyImage.objects.filter(property=prop, id=image_id).delete()
        if not deleted:
            return Response({'detail': 'Image not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'], permission_classes=[IsEditorOrAbove])
    def add_floor_plan(self, request, slug=None):
        prop = self.get_object()
        if not request.FILES.get('image') and not request.FILES.get('pdf'):
            return Response({'detail': 'Provide an image or a PDF.'}, status=status.HTTP_400_BAD_REQUEST)
        fp = FloorPlan.objects.create(
            property=prop,
            title=request.data.get('title') or 'Floor Plan',
            image=request.FILES.get('image'),
            pdf=request.FILES.get('pdf'),
            bedrooms=request.data.get('bedrooms') or None,
            area_sqft=request.data.get('area_sqft') or None,
        )
        return Response(FloorPlanSerializer(fp, context={'request': request}).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path='floor-plans/(?P<plan_id>[^/.]+)', permission_classes=[IsEditorOrAbove])
    def delete_floor_plan(self, request, slug=None, plan_id=None):
        prop = self.get_object()
        deleted, _ = FloorPlan.objects.filter(property=prop, id=plan_id).delete()
        if not deleted:
            return Response({'detail': 'Floor plan not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)


class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    pagination_class = None

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsEditorOrAbove()]
        return [IsAuthenticatedOrReadOnly()]
