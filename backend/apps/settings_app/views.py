from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import SiteSettings
from .serializers import SiteSettingsSerializer
from apps.users.permissions import IsAdminOrAbove


@api_view(['GET'])
@permission_classes([AllowAny])
def get_settings(request):
    settings = SiteSettings.get_settings()
    return Response(SiteSettingsSerializer(settings).data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminOrAbove])
def update_settings(request):
    settings = SiteSettings.get_settings()
    serializer = SiteSettingsSerializer(settings, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAdminOrAbove])
def dashboard_stats(request):
    from apps.properties.models import Property
    from apps.leads.models import Lead
    from apps.projects.models import Project
    from apps.developers.models import Developer
    from apps.communities.models import Community
    from apps.agents.models import Agent
    from apps.blogs.models import Blog
    from django.utils import timezone
    from django.db.models import Count, Sum

    today = timezone.now().date()
    month_start = today.replace(day=1)

    return Response({
        'properties': {
            'total': Property.objects.count(),
            'published': Property.objects.filter(status='published').count(),
            'featured': Property.objects.filter(is_featured=True).count(),
        },
        'leads': {
            'total': Lead.objects.count(),
            'today': Lead.objects.filter(created_at__date=today).count(),
            'this_month': Lead.objects.filter(created_at__date__gte=month_start).count(),
            'new': Lead.objects.filter(status='new').count(),
        },
        'projects': Project.objects.count(),
        'developers': Developer.objects.count(),
        'communities': Community.objects.count(),
        'agents': Agent.objects.filter(is_active=True).count(),
        'blogs': Blog.objects.filter(status='published').count(),
    })
