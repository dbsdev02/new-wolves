from rest_framework import serializers
from .models import Community


class CommunityListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = ['id', 'name', 'slug', 'image', 'short_description', 'city', 'total_properties', 'is_featured']


class CommunityDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = '__all__'
