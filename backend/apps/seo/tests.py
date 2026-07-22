from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Redirect

User = get_user_model()


class RedirectTests(APITestCase):
    def setUp(self):
        self.active = Redirect.objects.create(from_url='/old-page', to_url='/new-page', is_active=True)
        self.inactive = Redirect.objects.create(from_url='/gone-page', to_url='/home', is_active=False)

    def test_active_endpoint_is_public_and_returns_only_active_redirects(self):
        response = self.client.get('/api/v1/seo/redirects/active/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        urls = [r['from_url'] for r in response.data]
        self.assertIn('/old-page', urls)
        self.assertNotIn('/gone-page', urls)

    def test_list_requires_admin_role(self):
        response = self.client.get('/api/v1/seo/redirects/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_see_all_redirects_including_inactive(self):
        admin = User.objects.create_user(
            username='admin', email='admin@example.com', password='AdminPass123', role='admin',
        )
        self.client.force_authenticate(admin)
        response = self.client.get('/api/v1/seo/redirects/')
        urls = [r['from_url'] for r in response.data['results']]
        self.assertIn('/old-page', urls)
        self.assertIn('/gone-page', urls)
