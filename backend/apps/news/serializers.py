from rest_framework import serializers
from .models import NewsItem, TickerStat


class NewsItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsItem
        fields = ['id', 'headline', 'link', 'order', 'is_active']


class TickerStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = TickerStat
        fields = ['id', 'label', 'value', 'order', 'is_active']
