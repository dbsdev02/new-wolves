from rest_framework import serializers
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
        fields = ['id', 'title', 'image', 'bedrooms', 'area_sqft']


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
            'status', 'completion_status', 'price', 'currency', 'price_per_sqft',
            'address', 'city', 'community_name', 'developer_name', 'agent_name',
            'agent_phone', 'bedrooms', 'bathrooms', 'area_sqft', 'parking_spaces',
            'featured_image', 'primary_image', 'is_featured', 'is_hot', 'is_luxury',
            'is_new_launch', 'views_count', 'created_at',
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img:
            request = self.context.get('request')
            return request.build_absolute_uri(img.image.url) if request else img.image.url
        return None


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
                'photo': self.context['request'].build_absolute_uri(obj.agent.photo.url) if obj.agent.photo else None,
                'designation': obj.agent.designation,
            }
        return None


class PropertyWriteSerializer(serializers.ModelSerializer):
    amenity_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)

    class Meta:
        model = Property
        exclude = ['slug', 'reference_number', 'views_count', 'inquiries_count', 'created_by']

    def create(self, validated_data):
        amenity_ids = validated_data.pop('amenity_ids', [])
        validated_data['created_by'] = self.context['request'].user
        property_obj = super().create(validated_data)
        if amenity_ids:
            property_obj.amenities.set(amenity_ids)
        return property_obj

    def update(self, instance, validated_data):
        amenity_ids = validated_data.pop('amenity_ids', None)
        instance = super().update(instance, validated_data)
        if amenity_ids is not None:
            instance.amenities.set(amenity_ids)
        return instance
