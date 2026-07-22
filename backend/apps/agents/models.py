from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Agent(models.Model):
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='agent_profile')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    designation = models.CharField(max_length=200, blank=True)
    photo = models.ImageField(upload_to='agents/photos/', blank=True, null=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    whatsapp = models.CharField(max_length=20, blank=True)
    languages = models.CharField(max_length=300, blank=True, help_text='Comma separated')
    bio = models.TextField(blank=True)
    experience_years = models.PositiveSmallIntegerField(default=0)
    specializations = models.CharField(max_length=500, blank=True)
    rera_number = models.CharField(max_length=100, blank=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    # Social
    linkedin = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    twitter = models.URLField(blank=True)

    # Stats
    total_properties = models.PositiveIntegerField(default=0)
    total_deals = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'agents'
        ordering = ['first_name']

    def __str__(self):
        return self.full_name

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class AgentReview(models.Model):
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name='reviews')
    reviewer_name = models.CharField(max_length=200)
    reviewer_email = models.EmailField(blank=True)
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'agent_reviews'
        ordering = ['-created_at']
