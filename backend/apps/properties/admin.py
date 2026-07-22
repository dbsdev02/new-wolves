from django.contrib import admin
from .models import Property, PropertyImage, FloorPlan, PaymentPlan, NearbyPlace, Amenity


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1


class FloorPlanInline(admin.TabularInline):
    model = FloorPlan
    extra = 0


class PaymentPlanInline(admin.TabularInline):
    model = PaymentPlan
    extra = 0


class NearbyPlaceInline(admin.TabularInline):
    model = NearbyPlace
    extra = 0


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ['title', 'reference_number', 'property_type', 'purpose', 'status', 'price', 'currency', 'is_featured', 'created_at']
    list_filter = ['status', 'purpose', 'property_type', 'is_featured', 'is_hot', 'is_luxury', 'completion_status']
    search_fields = ['title', 'reference_number', 'address']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [PropertyImageInline, FloorPlanInline, PaymentPlanInline, NearbyPlaceInline]
    filter_horizontal = ['amenities']
    readonly_fields = ['views_count', 'inquiries_count', 'created_at', 'updated_at']
    list_editable = ['status', 'is_featured']


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'category']
    list_filter = ['category']
    search_fields = ['name']
