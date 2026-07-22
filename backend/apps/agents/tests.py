from rest_framework import status
from rest_framework.test import APITestCase

from .models import Agent


def make_agent(**kwargs):
    defaults = dict(
        first_name='Jane', last_name='Agent', email='jane.agent@example.com',
        phone='+971501234567', is_active=True,
    )
    defaults.update(kwargs)
    return Agent.objects.create(**defaults)


class AgentListTests(APITestCase):
    def setUp(self):
        self.agent = make_agent(is_featured=True)

    def test_list_returns_active_agents(self):
        response = self.client.get('/api/v1/agents/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        names = [a['first_name'] for a in response.data['results']]
        self.assertIn('Jane', names)

    def test_inactive_agents_are_excluded(self):
        make_agent(email='inactive@example.com', is_active=False)
        response = self.client.get('/api/v1/agents/')
        emails_visible = [a.get('email') for a in response.data['results']]
        self.assertNotIn('inactive@example.com', emails_visible)

    def test_featured_endpoint_returns_only_featured_agents(self):
        make_agent(email='not-featured@example.com', is_featured=False)
        response = self.client.get('/api/v1/agents/featured/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        emails = [a['email'] for a in response.data]
        self.assertIn('jane.agent@example.com', emails)
        self.assertNotIn('not-featured@example.com', emails)

    def test_add_review_is_open_to_anonymous_users(self):
        response = self.client.post(f'/api/v1/agents/{self.agent.id}/add_review/', {
            'reviewer_name': 'Happy Client', 'rating': 5, 'comment': 'Great service!',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.agent.reviews.count(), 1)

    def test_detail_includes_average_rating(self):
        self.agent.reviews.create(reviewer_name='A', rating=5, comment='Good', is_approved=True)
        self.agent.reviews.create(reviewer_name='B', rating=3, comment='Ok', is_approved=True)
        response = self.client.get(f'/api/v1/agents/{self.agent.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['average_rating'], 4.0)
