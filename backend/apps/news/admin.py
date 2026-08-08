from django.contrib import admin
from .models import NewsItem, TickerStat


@admin.register(NewsItem)
class NewsItemAdmin(admin.ModelAdmin):
    list_display = ['headline', 'order', 'is_active', 'created_at']
    list_filter = ['is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['headline']


@admin.register(TickerStat)
class TickerStatAdmin(admin.ModelAdmin):
    list_display = ['label', 'value', 'order', 'is_active']
    list_editable = ['value', 'order', 'is_active']
