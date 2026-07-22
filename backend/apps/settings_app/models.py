from django.db import models


class SiteSettings(models.Model):
    # Company
    company_name = models.CharField(max_length=200, default='Wolves International')
    tagline = models.CharField(max_length=500, blank=True)
    logo = models.ImageField(upload_to='settings/logo/', blank=True, null=True)
    logo_dark = models.ImageField(upload_to='settings/logo/', blank=True, null=True)
    favicon = models.ImageField(upload_to='settings/favicon/', blank=True, null=True)
    description = models.TextField(blank=True)

    # Contact
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    whatsapp = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, default='Dubai')
    country = models.CharField(max_length=100, default='UAE')
    google_maps_url = models.URLField(blank=True)
    google_maps_embed = models.TextField(blank=True)

    # Social
    facebook = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    youtube = models.URLField(blank=True)
    tiktok = models.URLField(blank=True)

    # Business
    rera_number = models.CharField(max_length=100, blank=True)
    trade_license = models.CharField(max_length=100, blank=True)
    working_hours = models.CharField(max_length=200, blank=True)

    # Analytics
    google_analytics_id = models.CharField(max_length=50, blank=True)
    google_tag_manager_id = models.CharField(max_length=50, blank=True)
    facebook_pixel_id = models.CharField(max_length=50, blank=True)

    # Scripts
    header_scripts = models.TextField(blank=True)
    footer_scripts = models.TextField(blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'site_settings'
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return self.company_name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
