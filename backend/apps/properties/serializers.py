from rest_framework import serializers
from apps.utils import get_image_url
from .models import Property, PropertyImage, FloorPlan, PaymentPlan, NearbyPlace, Amenity


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'name', 'icon', 'category']


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'caption', 'is_primary', 'order']


class FloorPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = FloorPlan
        fields = ['id', 'title', 'image', 'pdf', 'bedrooms', 'area_sqft']


class PaymentPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentPlan
        fields = ['id', 'title', 'percentage', 'milestone', 'due_date']


class NearbyPlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NearbyPlace
        fields = ['id', 'name', 'category', 'distance_km', 'duration_minutes']


class PropertyListSerializer(serializers.ModelSerializer):
    community_name = serializers.CharField(source='community.name', read_only=True)
    developer_name = serializers.CharField(source='developer.name', read_only=True)
    agent_name = serializers.CharField(source='agent.full_name', read_only=True)
    agent_phone = serializers.CharField(source='agent.phone', read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'slug', 'reference_number', 'property_type', 'purpose',
            'status', 'completion_status', 'handover_date', 'price', 'currency', 'price_per_sqft',
            'address', 'nearby_area', 'city', 'community_name', 'developer_name', 'agent_name',
            'agent_phone', 'min_bedrooms', 'max_bedrooms', 'bathrooms', 'area_sqft', 'parking_spaces',
            'featured_image', 'primary_image', 'is_featured', 'is_hot', 'is_luxury',
            'is_new_launch', 'views_count', 'created_at',
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        return get_image_url(img.image) if img else None


class PropertyDetailSerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    floor_plans = FloorPlanSerializer(many=True, read_only=True)
    payment_plans = PaymentPlanSerializer(many=True, read_only=True)
    nearby_places = NearbyPlaceSerializer(many=True, read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    community_name = serializers.CharField(source='community.name', read_only=True)
    community_slug = serializers.CharField(source='community.slug', read_only=True)
    developer_name = serializers.CharField(source='developer.name', read_only=True)
    developer_slug = serializers.CharField(source='developer.slug', read_only=True)
    developer_logo = serializers.ImageField(source='developer.logo', read_only=True)
    agent_data = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = '__all__'

    def get_agent_data(self, obj):
        if obj.agent:
            return {
                'id': obj.agent.id,
                'name': obj.agent.full_name,
                'phone': obj.agent.phone,
                'whatsapp': obj.agent.whatsapp,
                'email': obj.agent.email,
                'photo': get_image_url(obj.agent.photo),
                'designation': obj.agent.designation,
                'rera_number': obj.agent.rera_number,
            }
        return None


class PropertyWriteSerializer(serializers.ModelSerializer):
    # Declared explicitly (rather than left to ModelSerializer's default
    # JSONField mapping) so multipart form data — which can only send
    # strings, not native JSON — is read the same way amenity_ids already
    # is: as repeated `property_type` form keys, one per selected type.
    property_type = serializers.ListField(
        child=serializers.ChoiceField(choices=[c[0] for c in Property.TYPE_CHOICES]),
        allow_empty=False,
    )
    # Same reasoning as property_type above — nearby_area is a JSON list now,
    # sent as repeated form keys from multipart requests.
    nearby_area = serializers.ListField(
        child=serializers.ChoiceField(choices=[c[0] for c in Property.NEARBY_AREA_CHOICES]),
        required=False,
    )
    amenity_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    # HTML multipart forms can't distinguish "amenity_ids omitted" from "amenity_ids
    # sent as an empty list" (DRF's ListField.get_value falls back to `empty` either
    # way), so an explicit flag is needed to represent "clear all amenities".
    clear_amenities = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta:
        model = Property
        exclude = ['slug', 'reference_number', 'views_count', 'inquiries_count', 'created_by']

    def create(self, validated_data):
        amenity_ids = validated_data.pop('amenity_ids', [])
        validated_data.pop('clear_amenities', None)
        validated_data['created_by'] = self.context['request'].user
        property_obj = super().create(validated_data)
        if amenity_ids:
            property_obj.amenities.set(amenity_ids)
        return property_obj

    def update(self, instance, validated_data):
        amenity_ids = validated_data.pop('amenity_ids', None)
        clear_amenities = validated_data.pop('clear_amenities', False)
        instance = super().update(instance, validated_data)
        if amenity_ids is not None:
            instance.amenities.set(amenity_ids)
        elif clear_amenities:
            instance.amenities.set([])
        return instance
