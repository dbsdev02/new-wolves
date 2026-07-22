from django.contrib import admin
from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'lead_type', 'status', 'assigned_agent', 'created_at']
    list_filter = ['status', 'lead_type', 'created_at']
    search_fields = ['name', 'email', 'phone']
    list_editable = ['status', 'assigned_agent']
    readonly_fields = ['ip_address', 'user_agent', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'
