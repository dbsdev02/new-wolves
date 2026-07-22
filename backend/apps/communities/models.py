from django.db import models
from django.utils.text import slugify


class Community(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    image = models.ImageField(upload_to='communities/images/', blank=True, null=True)
    cover_image = models.ImageField(upload_to='communities/covers/', blank=True, null=True)
    description = models.TextField(blank=True)
    short_description = models.CharField(max_length=500, blank=True)
    city = models.CharField(max_length=100, default='Dubai')
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    total_properties = models.PositiveIntegerField(default=0)

    # Nearby
    nearby_schools = models.TextField(blank=True)
    nearby_hospitals = models.TextField(blank=True)
    nearby_malls = models.TextField(blank=True)
    nearby_metro = models.TextField(blank=True)

    # SEO
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'communities'
        verbose_name_plural = 'Communities'
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
