import django_filters
from .models import Property


class PropertyFilter(django_filters.FilterSet):
    # property_type is now a JSON list (a property can have more than one
    # type), so django_filter's auto exact-match generation doesn't apply —
    # match if the requested type is anywhere in the list. Matching against
    # the field's raw JSON text is a deliberate simplification: it works
    # identically across SQLite/MySQL (unlike JSONField's `contains` lookup,
    # which SQLite doesn't support) and is safe because no TYPE_CHOICES slug
    # is a substring of another.
    property_type = django_filters.CharFilter(method='filter_property_type')
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

    def filter_property_type(self, queryset, name, value):
        return queryset.filter(property_type__icontains=value)

    class Meta:
        model = Property
        fields = [
            'purpose', 'status', 'completion_status',
            'bathrooms', 'currency', 'furnishing',
        ]
