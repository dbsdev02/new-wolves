from django.contrib import admin
from .models import Project, ProjectImage


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'developer', 'community', 'status', 'min_price', 'is_featured', 'is_active']
    list_filter = ['status', 'is_featured', 'is_active']
    search_fields = ['name', 'address']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProjectImageInline]
    list_editable = ['is_featured', 'is_active']
    readonly_fields = ['created_at', 'updated_at']
