from rest_framework import serializers
from .models import Project, ProjectImage


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'caption', 'order']


class ProjectListSerializer(serializers.ModelSerializer):
    developer_name = serializers.CharField(source='developer.name', read_only=True)
    developer_logo = serializers.ImageField(source='developer.logo', read_only=True)
    community_name = serializers.CharField(source='community.name', read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'slug', 'developer_name', 'developer_logo', 'community_name',
            'featured_image', 'short_description', 'status', 'completion_date',
            'min_price', 'max_price', 'currency', 'total_units', 'available_units', 'is_featured',
        ]


class ProjectDetailSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)
    developer_name = serializers.CharField(source='developer.name', read_only=True)
    developer_logo = serializers.ImageField(source='developer.logo', read_only=True)
    community_name = serializers.CharField(source='community.name', read_only=True)

    class Meta:
        model = Project
        fields = '__all__'
