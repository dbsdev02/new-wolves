from rest_framework import serializers
from .models import Lead


class LeadCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = [
            'name', 'email', 'phone', 'nationality', 'message', 'lead_type',
            'property', 'project', 'preferred_date', 'preferred_time',
            'loan_amount', 'down_payment', 'employment_type',
            'position', 'resume', 'experience_years', 'is_newsletter',
            'utm_source', 'utm_medium', 'utm_campaign',
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        if request:
            validated_data['ip_address'] = request.META.get('REMOTE_ADDR')
            validated_data['user_agent'] = request.META.get('HTTP_USER_AGENT', '')
        return super().create(validated_data)


class LeadSerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(source='property.title', read_only=True)
    agent_name = serializers.CharField(source='assigned_agent.full_name', read_only=True)

    class Meta:
        model = Lead
        fields = '__all__'


class LeadUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ['status', 'assigned_agent', 'notes', 'follow_up_date']
