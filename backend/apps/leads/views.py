from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.http import HttpResponse
from django.utils import timezone
from .models import Lead
from .serializers import LeadCreateSerializer, LeadSerializer, LeadUpdateSerializer
from apps.users.permissions import IsSalesOrAbove, IsAdminOrAbove
import csv


class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.select_related('property', 'assigned_agent').all()
    permission_classes = [IsSalesOrAbove]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'lead_type', 'assigned_agent']
    search_fields = ['name', 'email', 'phone']
    ordering_fields = ['created_at', 'status']

    def get_serializer_class(self):
        if self.action == 'create':
            return LeadCreateSerializer
        if self.action in ['update', 'partial_update']:
            return LeadUpdateSerializer
        return LeadSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        lead = serializer.save()
        # Send notification email (async in production)
        from .tasks import send_lead_notification
        try:
            send_lead_notification(lead.id)
        except Exception:
            pass
        return Response({'message': 'Thank you! We will contact you shortly.'}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], permission_classes=[IsAdminOrAbove])
    def export_csv(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="leads_{timezone.now().date()}.csv"'
        writer = csv.writer(response)
        writer.writerow(['Name', 'Email', 'Phone', 'Type', 'Status', 'Property', 'Date'])
        for lead in self.get_queryset():
            writer.writerow([
                lead.name, lead.email, lead.phone, lead.lead_type,
                lead.status, lead.property.title if lead.property else '',
                lead.created_at.strftime('%Y-%m-%d %H:%M'),
            ])
        return response

    @action(detail=False, methods=['get'], permission_classes=[IsAdminOrAbove])
    def stats(self, request):
        from django.db.models import Count
        from django.utils import timezone
        today = timezone.now().date()
        return Response({
            'total': Lead.objects.count(),
            'today': Lead.objects.filter(created_at__date=today).count(),
            'this_month': Lead.objects.filter(created_at__month=today.month, created_at__year=today.year).count(),
            'by_status': list(Lead.objects.values('status').annotate(count=Count('id'))),
            'by_type': list(Lead.objects.values('lead_type').annotate(count=Count('id'))),
        })
