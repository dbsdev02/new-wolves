from django.db import models
from django.utils.text import slugify


class Developer(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    logo = models.ImageField(upload_to='developers/logos/', blank=True, null=True)
    cover_image = models.ImageField(upload_to='developers/covers/', blank=True, null=True)
    description = models.TextField(blank=True)
    short_description = models.CharField(max_length=500, blank=True)
    founded_year = models.PositiveSmallIntegerField(null=True, blank=True)
    headquarters = models.CharField(max_length=200, blank=True)
    website = models.URLField(blank=True)
    total_projects = models.PositiveIntegerField(default=0)
    total_units = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    # SEO
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'developers'
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
