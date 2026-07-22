from django.contrib import admin
from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['name', 'designation', 'rating', 'is_featured', 'is_active', 'order']
    list_filter = ['is_featured', 'is_active', 'rating']
    list_editable = ['is_featured', 'is_active', 'order']
    search_fields = ['name', 'content']
