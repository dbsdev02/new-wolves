from rest_framework import serializers
from .models import Blog, BlogCategory, BlogTag, BlogComment


class BlogCategorySerializer(serializers.ModelSerializer):
    blog_count = serializers.SerializerMethodField()

    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug', 'description', 'image', 'blog_count']

    def get_blog_count(self, obj):
        return obj.blogs.filter(status='published').count()


class BlogTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogTag
        fields = ['id', 'name', 'slug']


class BlogCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogComment
        fields = ['id', 'name', 'comment', 'created_at']


class BlogListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    author_name = serializers.SerializerMethodField()
    tags = BlogTagSerializer(many=True, read_only=True)

    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'slug', 'excerpt', 'featured_image', 'author_name',
            'category_name', 'category_slug', 'tags', 'is_featured',
            'views_count', 'read_time', 'published_at', 'created_at',
        ]

    def get_author_name(self, obj):
        return obj.author.get_full_name() if obj.author else 'Admin'


class BlogDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    tags = BlogTagSerializer(many=True, read_only=True)
    comments = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = '__all__'

    def get_comments(self, obj):
        return BlogCommentSerializer(obj.comments.filter(is_approved=True), many=True).data

    def get_author_name(self, obj):
        return obj.author.get_full_name() if obj.author else 'Admin'

    def get_author_avatar(self, obj):
        if obj.author and obj.author.avatar:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.author.avatar.url) if request else obj.author.avatar.url
        return None


class BlogWriteSerializer(serializers.ModelSerializer):
    tag_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)

    class Meta:
        model = Blog
        exclude = ['slug', 'views_count', 'author']

    def create(self, validated_data):
        tag_ids = validated_data.pop('tag_ids', [])
        validated_data['author'] = self.context['request'].user
        blog = super().create(validated_data)
        if tag_ids:
            blog.tags.set(tag_ids)
        return blog

    def update(self, instance, validated_data):
        tag_ids = validated_data.pop('tag_ids', None)
        instance = super().update(instance, validated_data)
        if tag_ids is not None:
            instance.tags.set(tag_ids)
        return instance
