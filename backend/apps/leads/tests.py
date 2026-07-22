from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Lead

User = get_user_model()


class LeadCreationTests(APITestCase):
    def test_anonymous_user_can_submit_a_lead(self):
        response = self.client.post('/api/v1/leads/', {
            'name': 'Jane Buyer', 'email': 'jane@example.com', 'phone': '+971501234567',
            'message': 'I am interested in this property.', 'lead_type': 'contact',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Lead.objects.filter(email='jane@example.com').exists())

    def test_lead_missing_required_fields_returns_400(self):
        response = self.client.post('/api/v1/leads/', {'message': 'Missing name and email'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_lead_captures_ip_address(self):
        self.client.post('/api/v1/leads/', {
            'name': 'Bob Buyer', 'email': 'bob@example.com', 'lead_type': 'contact',
        }, REMOTE_ADDR='1.2.3.4')
        lead = Lead.objects.get(email='bob@example.com')
        self.assertEqual(lead.ip_address, '1.2.3.4')


class LeadListPermissionTests(APITestCase):
    def setUp(self):
        Lead.objects.create(name='Existing Lead', email='existing@example.com', lead_type='contact')

    def test_anonymous_user_cannot_list_leads(self):
        response = self.client.get('/api/v1/leads/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_viewer_role_cannot_list_leads(self):
        viewer = User.objects.create_user(
            username='viewer', email='viewer@example.com', password='ViewerPass123', role='viewer',
        )
        self.client.force_authenticate(viewer)
        response = self.client.get('/api/v1/leads/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_sales_role_can_list_leads(self):
        sales = User.objects.create_user(
            username='sales', email='sales@example.com', password='SalesPass123', role='sales',
        )
        self.client.force_authenticate(sales)
        response = self.client.get('/api/v1/leads/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_export_csv_requires_admin_role(self):
        sales = User.objects.create_user(
            username='sales2', email='sales2@example.com', password='SalesPass123', role='sales',
        )
        self.client.force_authenticate(sales)
        response = self.client.get('/api/v1/leads/export_csv/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_stats_endpoint_requires_admin_role(self):
        admin = User.objects.create_user(
            username='admin', email='admin2@example.com', password='AdminPass123', role='admin',
        )
        self.client.force_authenticate(admin)
        response = self.client.get('/api/v1/leads/stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total', response.data)
