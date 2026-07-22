from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AuthTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='john', email='john@example.com', password='StrongPass123',
            first_name='John', last_name='Doe', role='admin',
        )

    def test_login_with_valid_credentials_returns_tokens(self):
        response = self.client.post('/api/v1/auth/login/', {
            'email': 'john@example.com', 'password': 'StrongPass123',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_with_invalid_credentials_fails(self):
        response = self.client.post('/api/v1/auth/login/', {
            'email': 'john@example.com', 'password': 'WrongPassword',
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_endpoint_requires_authentication(self):
        response = self.client.get('/api/v1/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_endpoint_returns_current_user(self):
        self.client.force_authenticate(self.user)
        response = self.client.get('/api/v1/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'john@example.com')

    def test_change_password_with_wrong_old_password_fails(self):
        self.client.force_authenticate(self.user)
        response = self.client.post('/api/v1/auth/change-password/', {
            'old_password': 'WrongOldPassword', 'new_password': 'NewPass1234',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_change_password_with_correct_old_password_succeeds(self):
        self.client.force_authenticate(self.user)
        response = self.client.post('/api/v1/auth/change-password/', {
            'old_password': 'StrongPass123', 'new_password': 'NewPass1234',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewPass1234'))

    def test_user_list_requires_admin_role(self):
        viewer = User.objects.create_user(
            username='viewer', email='viewer@example.com', password='ViewerPass123', role='viewer',
        )
        self.client.force_authenticate(viewer)
        response = self.client.get('/api/v1/auth/users/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_list_accessible_by_admin(self):
        self.client.force_authenticate(self.user)
        response = self.client.get('/api/v1/auth/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class PasswordResetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='reset', email='reset@example.com', password='OldPass123', role='viewer',
        )

    def test_forgot_password_sends_email_for_existing_user(self):
        response = self.client.post('/api/v1/auth/forgot-password/', {'email': 'reset@example.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('reset@example.com', mail.outbox[0].to)

    def test_forgot_password_does_not_leak_unknown_email(self):
        response = self.client.post('/api/v1/auth/forgot-password/', {'email': 'unknown@example.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 0)

    def test_reset_password_with_valid_token_succeeds(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)
        response = self.client.post('/api/v1/auth/reset-password/', {
            'uid': uid, 'token': token, 'new_password': 'BrandNewPass123',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('BrandNewPass123'))

    def test_reset_password_with_invalid_token_fails(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        response = self.client.post('/api/v1/auth/reset-password/', {
            'uid': uid, 'token': 'invalid-token', 'new_password': 'BrandNewPass123',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reset_password_with_invalid_uid_fails(self):
        response = self.client.post('/api/v1/auth/reset-password/', {
            'uid': 'not-a-real-uid', 'token': 'sometoken', 'new_password': 'BrandNewPass123',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reset_token_cannot_be_reused_after_password_change(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)
        self.client.post('/api/v1/auth/reset-password/', {
            'uid': uid, 'token': token, 'new_password': 'FirstNewPass123',
        })
        response = self.client.post('/api/v1/auth/reset-password/', {
            'uid': uid, 'token': token, 'new_password': 'SecondNewPass123',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
