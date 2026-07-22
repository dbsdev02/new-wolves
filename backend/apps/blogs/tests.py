from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Blog

User = get_user_model()


def make_blog(**kwargs):
    defaults = dict(
        title='Test Blog Post', content='<p>Some content</p>',
        status='published', published_at=timezone.now(),
    )
    defaults.update(kwargs)
    return Blog.objects.create(**defaults)


class BlogListTests(APITestCase):
    def setUp(self):
        self.published = make_blog(title='Published Post', status='published')
        self.draft = make_blog(title='Draft Post', status='draft')

    def test_list_only_returns_published_blogs(self):
        response = self.client.get('/api/v1/blogs/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [b['title'] for b in response.data['results']]
        self.assertIn('Published Post', titles)
        self.assertNotIn('Draft Post', titles)

    def test_retrieve_by_slug_increments_views(self):
        response = self.client.get(f'/api/v1/blogs/{self.published.slug}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.published.refresh_from_db()
        self.assertEqual(self.published.views_count, 1)

    def test_add_comment_is_open_to_anonymous_users(self):
        response = self.client.post(f'/api/v1/blogs/{self.published.slug}/add_comment/', {
            'name': 'Reader', 'email': 'reader@example.com', 'comment': 'Great article!',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.published.comments.count(), 1)

    def test_unapproved_comments_are_not_shown_in_detail(self):
        self.client.post(f'/api/v1/blogs/{self.published.slug}/add_comment/', {
            'name': 'Reader', 'email': 'reader@example.com', 'comment': 'Pending review',
        })
        response = self.client.get(f'/api/v1/blogs/{self.published.slug}/')
        self.assertEqual(len(response.data['comments']), 0)

    def test_create_blog_requires_editor_role(self):
        viewer = User.objects.create_user(
            username='viewer', email='viewer@example.com', password='ViewerPass123', role='viewer',
        )
        self.client.force_authenticate(viewer)
        response = self.client.post('/api/v1/blogs/', {'title': 'New Post', 'content': 'Content'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
