from django.contrib import admin
from .models import Agent, AgentReview


@admin.register(Agent)
class AgentAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'designation', 'email', 'phone', 'is_featured', 'is_active']
    list_filter = ['is_featured', 'is_active']
    search_fields = ['first_name', 'last_name', 'email', 'rera_number']


@admin.register(AgentReview)
class AgentReviewAdmin(admin.ModelAdmin):
    list_display = ['agent', 'reviewer_name', 'rating', 'is_approved', 'created_at']
    list_filter = ['is_approved', 'rating']
    list_editable = ['is_approved']
