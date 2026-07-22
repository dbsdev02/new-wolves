from django.contrib import admin
from .models import Developer


@admin.register(Developer)
class DeveloperAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'total_projects', 'total_units', 'is_featured', 'is_active']
    list_filter = ['is_featured', 'is_active']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_featured', 'is_active']
