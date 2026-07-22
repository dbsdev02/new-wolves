from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'first_name', 'last_name', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active']
    search_fields = ['email', 'first_name', 'last_name']
    list_editable = ['role', 'is_active']
    readonly_fields = ['created_at', 'updated_at', 'last_login']
    fieldsets = (
        ('Personal Info', {'fields': ('email', 'username', 'first_name', 'last_name', 'phone', 'avatar')}),
        ('Role & Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at', 'last_login')}),
    )
