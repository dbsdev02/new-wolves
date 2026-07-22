from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model

User = get_user_model()


class Amenity(models.Model):
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=50, blank=True)

    class Meta:
        db_table = 'amenities'
        verbose_name_plural = 'Amenities'
        ordering = ['name']

    def __str__(self):
        return self.name


class Property(models.Model):
    PURPOSE_CHOICES = [('sale', 'For Sale'), ('rent', 'For Rent'), ('off_plan', 'Off Plan')]
    STATUS_CHOICES = [
        ('draft', 'Draft'), ('published', 'Published'),
        ('archived', 'Archived'), ('sold', 'Sold'), ('rented', 'Rented'),
    ]
    TYPE_CHOICES = [
        ('apartment', 'Apartment'), ('villa', 'Villa'), ('townhouse', 'Townhouse'),
        ('penthouse', 'Penthouse'), ('duplex', 'Duplex'), ('studio', 'Studio'),
        ('office', 'Office'), ('retail', 'Retail'), ('warehouse', 'Warehouse'),
        ('land', 'Land'), ('building', 'Building'),
    ]
    CURRENCY_CHOICES = [('AED', 'AED'), ('USD', 'USD'), ('EUR', 'EUR'), ('GBP', 'GBP')]
    COMPLETION_CHOICES = [('ready', 'Ready'), ('off_plan', 'Off Plan'), ('under_construction', 'Under Construction')]

    # Core
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    description = models.TextField()
    reference_number = models.CharField(max_length=50, unique=True, blank=True)

    # Classification
    property_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    completion_status = models.CharField(max_length=30, choices=COMPLETION_CHOICES, default='ready')

    # Pricing
    price = models.DecimalField(max_digits=15, decimal_places=2)
    currency = models.CharField(max_length=5, choices=CURRENCY_CHOICES, default='AED')
    price_per_sqft = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    service_charge = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # Location
    address = models.CharField(max_length=500)
    city = models.CharField(max_length=100, default='Dubai')
    country = models.CharField(max_length=100, default='UAE')
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    google_maps_url = models.URLField(blank=True)

    # Relations
    community = models.ForeignKey('communities.Community', on_delete=models.SET_NULL, null=True, blank=True, related_name='properties')
    developer = models.ForeignKey('developers.Developer', on_delete=models.SET_NULL, null=True, blank=True, related_name='properties')
    project = models.ForeignKey('projects.Project', on_delete=models.SET_NULL, null=True, blank=True, related_name='properties')
    agent = models.ForeignKey('agents.Agent', on_delete=models.SET_NULL, null=True, blank=True, related_name='properties')

    # Specs
    bedrooms = models.PositiveSmallIntegerField(default=0)
    bathrooms = models.PositiveSmallIntegerField(default=0)
    area_sqft = models.DecimalField(max_digits=10, decimal_places=2)
    parking_spaces = models.PositiveSmallIntegerField(default=0)
    floor_number = models.PositiveSmallIntegerField(null=True, blank=True)
    total_floors = models.PositiveSmallIntegerField(null=True, blank=True)
    year_built = models.PositiveSmallIntegerField(null=True, blank=True)
    furnishing = models.CharField(max_length=30, choices=[
        ('furnished', 'Furnished'), ('semi_furnished', 'Semi Furnished'), ('unfurnished', 'Unfurnished')
    ], blank=True)

    # Media
    featured_image = models.ImageField(upload_to='properties/featured/', blank=True, null=True)
    video_url = models.URLField(blank=True)
    virtual_tour_url = models.URLField(blank=True)
    brochure = models.FileField(upload_to='properties/brochures/', blank=True, null=True)

    # Flags
    is_featured = models.BooleanField(default=False)
    is_hot = models.BooleanField(default=False)
    is_luxury = models.BooleanField(default=False)
    is_new_launch = models.BooleanField(default=False)
    is_exclusive = models.BooleanField(default=False)

    # Amenities
    amenities = models.ManyToManyField(Amenity, blank=True)

    # SEO
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    og_image = models.ImageField(upload_to='properties/og/', blank=True, null=True)

    # Stats
    views_count = models.PositiveIntegerField(default=0)
    inquiries_count = models.PositiveIntegerField(default=0)

    # Timestamps
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_properties')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'properties'
        verbose_name_plural = 'Properties'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'purpose']),
            models.Index(fields=['property_type']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['slug']),
            models.Index(fields=['price']),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            suffix = 1
            while Property.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                suffix += 1
                slug = f'{base_slug}-{suffix}'
            self.slug = slug
        if not self.reference_number:
            import random, string
            while True:
                candidate = 'WRE-' + ''.join(random.choices(string.digits, k=6))
                if not Property.objects.filter(reference_number=candidate).exists():
                    self.reference_number = candidate
                    break
        super().save(*args, **kwargs)


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='properties/gallery/')
    caption = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        db_table = 'property_images'
        ordering = ['order']


class FloorPlan(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='floor_plans')
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='properties/floor_plans/')
    bedrooms = models.PositiveSmallIntegerField(null=True, blank=True)
    area_sqft = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = 'floor_plans'


class PaymentPlan(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='payment_plans')
    title = models.CharField(max_length=100)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    milestone = models.CharField(max_length=255)
    due_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = 'payment_plans'
        ordering = ['percentage']


class NearbyPlace(models.Model):
    CATEGORY_CHOICES = [
        ('school', 'School'), ('hospital', 'Hospital'), ('metro', 'Metro'),
        ('mall', 'Mall'), ('restaurant', 'Restaurant'), ('beach', 'Beach'),
        ('airport', 'Airport'), ('park', 'Park'),
    ]
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='nearby_places')
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    distance_km = models.DecimalField(max_digits=5, decimal_places=2)
    duration_minutes = models.PositiveSmallIntegerField(null=True, blank=True)

    class Meta:
        db_table = 'nearby_places'
