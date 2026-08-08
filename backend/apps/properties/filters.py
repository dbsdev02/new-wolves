import django_filters
from .models import Property


class PropertyFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    min_area = django_filters.NumberFilter(field_name='area_sqft', lookup_expr='gte')
    max_area = django_filters.NumberFilter(field_name='area_sqft', lookup_expr='lte')
    # Range-overlap search: a property advertising e.g. 1-3 bedrooms should
    # match a search for "at least 2" (its max reaches 2+) or "at most 2"
    # (its min goes down to 2 or below), not an exact match on one field.
    min_bedrooms = django_filters.NumberFilter(field_name='max_bedrooms', lookup_expr='gte')
    max_bedrooms = django_filters.NumberFilter(field_name='min_bedrooms', lookup_expr='lte')
    community = django_filters.CharFilter(field_name='community__slug')
    developer = django_filters.CharFilter(field_name='developer__slug')
    project = django_filters.CharFilter(field_name='project__slug')
    agent = django_filters.NumberFilter(field_name='agent__id')
    city = django_filters.CharFilter(lookup_expr='icontains')
    is_featured = django_filters.BooleanFilter()
    is_hot = django_filters.BooleanFilter()
    is_luxury = django_filters.BooleanFilter()

    class Meta:
        model = Property
        fields = [
            'property_type', 'purpose', 'status', 'completion_status',
            'bathrooms', 'currency', 'furnishing',
        ]
