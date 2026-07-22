from django.contrib import admin
from .models import Community


@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'city', 'total_properties', 'is_featured', 'is_active']
    list_filter = ['is_featured', 'is_active', 'city']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_featured', 'is_active']
