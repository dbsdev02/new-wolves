from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Property

User = get_user_model()


def make_property(**kwargs):
    defaults = dict(
        title='Test Property', description='A lovely test property.',
        property_type='apartment', purpose='sale', status='published',
        price=1000000, address='Test Address', city='Dubai',
        bedrooms=2, bathrooms=2, area_sqft=1200,
    )
    defaults.update(kwargs)
    return Property.objects.create(**defaults)


class PropertyListTests(APITestCase):
    def setUp(self):
        self.published = make_property(title='Published Villa', status='published', is_featured=True)
        self.draft = make_property(title='Draft Villa', status='draft')

    def test_list_only_returns_published_properties_for_anonymous_users(self):
        response = self.client.get('/api/v1/properties/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [p['title'] for p in response.data['results']]
        self.assertIn('Published Villa', titles)
        self.assertNotIn('Draft Villa', titles)

    def test_editor_can_see_draft_properties(self):
        editor = User.objects.create_user(
            username='editor', email='editor@example.com', password='EditorPass123', role='editor',
        )
        self.client.force_authenticate(editor)
        response = self.client.get('/api/v1/properties/')
        titles = [p['title'] for p in response.data['results']]
        self.assertIn('Draft Villa', titles)

    def test_retrieve_increments_views_count(self):
        self.assertEqual(self.published.views_count, 0)
        response = self.client.get(f'/api/v1/properties/{self.published.slug}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.published.refresh_from_db()
        self.assertEqual(self.published.views_count, 1)

    def test_featured_endpoint_returns_only_featured_properties(self):
        response = self.client.get('/api/v1/properties/featured/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [p['title'] for p in response.data]
        self.assertIn('Published Villa', titles)

    def test_price_range_filter(self):
        make_property(title='Cheap Flat', price=300000, status='published')
        make_property(title='Expensive Villa', price=9000000, status='published')
        response = self.client.get('/api/v1/properties/', {'min_price': 500000, 'max_price': 5000000})
        titles = [p['title'] for p in response.data['results']]
        self.assertIn('Published Villa', titles)
        self.assertNotIn('Cheap Flat', titles)
        self.assertNotIn('Expensive Villa', titles)

    def test_create_requires_authentication(self):
        response = self.client.post('/api/v1/properties/', {'title': 'New Property'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_requires_editor_role(self):
        viewer = User.objects.create_user(
            username='viewer2', email='viewer2@example.com', password='ViewerPass123', role='viewer',
        )
        self.client.force_authenticate(viewer)
        response = self.client.post('/api/v1/properties/', {'title': 'New Property'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_editor_can_create_property(self):
        editor = User.objects.create_user(
            username='editor2', email='editor2@example.com', password='EditorPass123', role='editor',
        )
        self.client.force_authenticate(editor)
        response = self.client.post('/api/v1/properties/', {
            'title': 'Brand New Property', 'description': 'Great place',
            'property_type': 'apartment', 'purpose': 'sale', 'status': 'published',
            'price': 2000000, 'address': 'Somewhere', 'city': 'Dubai',
            'bedrooms': 3, 'bathrooms': 2, 'area_sqft': 1500,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Property.objects.filter(title='Brand New Property').exists())


class PropertySlugAndReferenceTests(APITestCase):
    def test_slug_is_auto_generated_and_unique_for_duplicate_titles(self):
        p1 = make_property(title='Duplicate Title')
        p2 = make_property(title='Duplicate Title')
        self.assertNotEqual(p1.slug, p2.slug)

    def test_reference_number_is_auto_generated_and_unique(self):
        p1 = make_property(title='Ref Number Test One')
        p2 = make_property(title='Ref Number Test Two')
        self.assertTrue(p1.reference_number.startswith('WRE-'))
        self.assertNotEqual(p1.reference_number, p2.reference_number)
