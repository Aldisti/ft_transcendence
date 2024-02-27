
from django.urls import reverse

from rest_framework.test import APITestCase

from .models import UserTFA, TFATypes

from users.models import User


class TFAViewsTest(APITestCase):
    def setUp(self):
        self.user_on = User.objects.create_user(
            username='tester1',
            email='tester1@localhost',
            password='password',
        )
        user_tfa = UserTFA.objects.create(self.user_on)
        user_tfa = UserTFA.objects.activate(user_tfa, TFATypes.SOFTWARE)
        UserTFA.objects.update_active(user_tfa)
        self.user_off = User.objects.create_user(
            username='tester2',
            email='tester2@localhost',
            password='password',
        )
        UserTFA.objects.create(self.user_off)

    def test_get_manage(self):
        self.client.force_authenticate(user=self.user_on)
        response = self.client.get(reverse('manage'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['is_active'])
        self.assertEqual(response.data['type'], TFATypes.SOFTWARE)
        self.client.force_authenticate(user=self.user_off)
        response = self.client.get(reverse('manage'))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data['is_active'])
        self.assertEqual(response.data['type'], TFATypes.NONE)

    def test_valid_activation_process(self):
        user = self.user_off
        self.client.force_authenticate(user=user)
        response = self.client.post(
            reverse('manage'),
            data={'type': TFATypes.SOFTWARE}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['token'], user.user_tfa.otp_token)
        self.assertEqual(response.data['uri'], user.user_tfa.get_uri())
        user_tfa = user.user_tfa
        code = user_tfa.get_code()
        response = self.client.post(
            reverse('validate_activate'),
            data={'code': code}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn('codes', response.data)
        self.assertEqual(len(response.data['codes']), len(user.user_tfa.codes.all()))

    def test_invalid_activation_process(self):
        user = self.user_on
        self.client.force_authenticate(user=user)
        response = self.client.post(
            reverse('manage'),
            data={'type': TFATypes.SOFTWARE}
        )
        self.assertEqual(response.status_code, 400)
        response = self.client.post(
            reverse('validate_activate'),
            data={'code': user.user_tfa.get_code()}
        )
        self.assertEqual(response.status_code, 403)

    def test_valid_login(self):
        user = self.user_on
        response = self.client.post(
            reverse('api-login'),
            data={'username': user.username, 'password': 'password'},
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['type'], user.user_tfa.otp_type)
        token = response.data['token']
        response = self.client.post(
            reverse('validate_login'),
            data={'token': token, 'code': user.user_tfa.get_code()},
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', response.data)

    def test_valid_deatcivate(self):
        user = self.user_on
        self.client.force_authenticate(user=user)
        response = self.client.put(
            reverse('manage'),
            data={'code': user.user_tfa.get_code()},
        )
        self.assertEqual(response.status_code, 200)
        user_tfa = user.user_tfa
        self.assertFalse(user_tfa.active)
        self.assertEqual(user_tfa.otp_token, '')
