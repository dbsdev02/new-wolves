from rest_framework import serializers
from .models import Agent, AgentReview


class AgentReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentReview
        fields = ['id', 'reviewer_name', 'rating', 'comment', 'created_at']


class AgentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = [
            'id', 'first_name', 'last_name', 'designation', 'photo',
            'phone', 'whatsapp', 'email', 'languages', 'experience_years',
            'total_properties', 'total_deals', 'is_featured', 'rera_number',
        ]


class AgentDetailSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Agent
        exclude = ['user']

    def get_reviews(self, obj):
        reviews = obj.reviews.filter(is_approved=True)[:10]
        return AgentReviewSerializer(reviews, many=True).data

    def get_average_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        if reviews.exists():
            return round(sum(r.rating for r in reviews) / reviews.count(), 1)
        return None
