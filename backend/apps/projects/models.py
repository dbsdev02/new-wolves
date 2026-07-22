from django.db import models
from django.utils.text import slugify


class Project(models.Model):
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'), ('under_construction', 'Under Construction'),
        ('ready', 'Ready'), ('sold_out', 'Sold Out'),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    developer = models.ForeignKey('developers.Developer', on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    community = models.ForeignKey('communities.Community', on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    description = models.TextField(blank=True)
    short_description = models.CharField(max_length=500, blank=True)
    featured_image = models.ImageField(upload_to='projects/featured/', blank=True, null=True)
    cover_image = models.ImageField(upload_to='projects/covers/', blank=True, null=True)
    brochure = models.FileField(upload_to='projects/brochures/', blank=True, null=True)
    video_url = models.URLField(blank=True)
    virtual_tour_url = models.URLField(blank=True)

    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='upcoming')
    completion_date = models.DateField(null=True, blank=True)
    launch_date = models.DateField(null=True, blank=True)

    min_price = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    max_price = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=5, default='AED')
    total_units = models.PositiveIntegerField(default=0)
    available_units = models.PositiveIntegerField(default=0)

    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    address = models.CharField(max_length=500, blank=True)

    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'projects'
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='projects/gallery/')
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        db_table = 'project_images'
        ordering = ['order']
