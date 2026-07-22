from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Lead(models.Model):
    TYPE_CHOICES = [
        ('contact', 'Contact'), ('property_inquiry', 'Property Inquiry'),
        ('schedule_visit', 'Schedule Visit'), ('mortgage', 'Mortgage Inquiry'),
        ('newsletter', 'Newsletter'), ('brochure', 'Brochure Download'),
        ('career', 'Career Application'), ('general', 'General'),
    ]
    STATUS_CHOICES = [
        ('new', 'New'), ('contacted', 'Contacted'), ('qualified', 'Qualified'),
        ('proposal', 'Proposal'), ('negotiation', 'Negotiation'),
        ('won', 'Won'), ('lost', 'Lost'), ('unqualified', 'Unqualified'),
    ]

    # Contact Info
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    nationality = models.CharField(max_length=100, blank=True)
    message = models.TextField(blank=True)

    # Lead Info
    lead_type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='general')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    source = models.CharField(max_length=100, blank=True, help_text='Website, Google, Social, etc.')

    # Relations
    property = models.ForeignKey('properties.Property', on_delete=models.SET_NULL, null=True, blank=True, related_name='leads')
    project = models.ForeignKey('projects.Project', on_delete=models.SET_NULL, null=True, blank=True, related_name='leads')
    assigned_agent = models.ForeignKey('agents.Agent', on_delete=models.SET_NULL, null=True, blank=True, related_name='leads')

    # Visit Scheduling
    preferred_date = models.DateField(null=True, blank=True)
    preferred_time = models.TimeField(null=True, blank=True)

    # Mortgage
    loan_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    down_payment = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    employment_type = models.CharField(max_length=50, blank=True)

    # Career
    position = models.CharField(max_length=200, blank=True)
    resume = models.FileField(upload_to='leads/resumes/', blank=True, null=True)
    experience_years = models.PositiveSmallIntegerField(null=True, blank=True)

    # CRM
    notes = models.TextField(blank=True)
    follow_up_date = models.DateField(null=True, blank=True)
    is_newsletter = models.BooleanField(default=False)

    # Meta
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    utm_source = models.CharField(max_length=100, blank=True)
    utm_medium = models.CharField(max_length=100, blank=True)
    utm_campaign = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'leads'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'lead_type']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.name} - {self.lead_type} ({self.status})"
