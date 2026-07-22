from django.db import models


class SEOPage(models.Model):
    page_identifier = models.CharField(max_length=200, unique=True, help_text='e.g. home, about, properties')
    title = models.CharField(max_length=255)
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.TextField(blank=True)
    canonical_url = models.URLField(blank=True)
    og_title = models.CharField(max_length=255, blank=True)
    og_description = models.TextField(blank=True)
    og_image = models.ImageField(upload_to='seo/og/', blank=True, null=True)
    twitter_title = models.CharField(max_length=255, blank=True)
    twitter_description = models.TextField(blank=True)
    twitter_image = models.ImageField(upload_to='seo/twitter/', blank=True, null=True)
    schema_markup = models.JSONField(blank=True, null=True)
    robots = models.CharField(max_length=100, default='index, follow')
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'seo_pages'
        verbose_name = 'SEO Page'

    def __str__(self):
        return self.page_identifier


class Redirect(models.Model):
    TYPE_CHOICES = [('301', 'Permanent (301)'), ('302', 'Temporary (302)')]
    from_url = models.CharField(max_length=500, unique=True)
    to_url = models.CharField(max_length=500)
    redirect_type = models.CharField(max_length=3, choices=TYPE_CHOICES, default='301')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'redirects'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.from_url} → {self.to_url}"
