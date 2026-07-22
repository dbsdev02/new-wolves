from django.contrib import admin
from .models import Blog, BlogCategory, BlogTag, BlogComment


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'status', 'is_featured', 'views_count', 'published_at']
    list_filter = ['status', 'is_featured', 'category']
    search_fields = ['title', 'excerpt']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['tags']
    list_editable = ['status', 'is_featured']


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(BlogComment)
class BlogCommentAdmin(admin.ModelAdmin):
    list_display = ['blog', 'name', 'email', 'is_approved', 'created_at']
    list_filter = ['is_approved']
    list_editable = ['is_approved']
