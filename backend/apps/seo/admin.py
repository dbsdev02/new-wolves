from django.contrib import admin
from .models import SEOPage, Redirect


@admin.register(SEOPage)
class SEOPageAdmin(admin.ModelAdmin):
    list_display = ['page_identifier', 'title', 'robots', 'is_active', 'updated_at']
    list_filter = ['is_active']
    search_fields = ['page_identifier', 'title']
    list_editable = ['is_active']


@admin.register(Redirect)
class RedirectAdmin(admin.ModelAdmin):
    list_display = ['from_url', 'to_url', 'redirect_type', 'is_active', 'created_at']
    list_filter = ['redirect_type', 'is_active']
    search_fields = ['from_url', 'to_url']
    list_editable = ['is_active']
