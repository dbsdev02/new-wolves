from django.db import models


class NewsItem(models.Model):
    headline = models.CharField(max_length=300)
    link = models.URLField(blank=True, help_text='Optional — makes the headline clickable')
    order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'news_items'
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.headline


class TickerStat(models.Model):
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=50, help_text='e.g. 1.02B, 205.35M')
    order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'ticker_stats'
        ordering = ['order']
        verbose_name = 'Ticker Stat'

    def __str__(self):
        return f'{self.label}: {self.value}'
