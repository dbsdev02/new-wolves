from rest_framework import serializers
from .models import Developer


class DeveloperListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Developer
        fields = ['id', 'name', 'slug', 'logo', 'short_description', 'total_projects', 'total_units', 'is_featured']


class DeveloperDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Developer
        fields = '__all__'
