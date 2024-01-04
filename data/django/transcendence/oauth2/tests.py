
from rest_framework.test import APIRequestFactory, APIClient, force_authenticate
from rest_framework import status

from django.test import TestCase
from django.core.exceptions import ValidationError

from accounts.models import User

from oauth2.models import UserIntra
from oauth2.settings import *


class UserIntraTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            'tester',
            'tester@email.com',
            'password'
        )
        self.name = 't-tester'
        self.email = 't-tester@student.email.com'

    def test_user_intra_creation(self):
        user_intra = UserIntra.objects.create(self.user, self.name, self.email)
        self.assertEqual(user_intra.user, self.user)
        self.assertEqual(user_intra.name, self.name)
        self.assertEqual(user_intra.email, self.email)

    def test_user_intra_duplicate_creation(self):
        user_intra = UserIntra.objects.create(self.user, self.name, self.email)
        with self.assertRaises(ValidationError):
            user_intra = UserIntra.objects.create(self.user, self.name, self.email)


class GetIntraUrlTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()

    def test_link_url_creation(self):
        response = self.client.get('/oauth2/intra/url/link/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('url', response.data)
        self.assertIn(quote(INTRA_LINK_REDIRECT_URI), response.data['url'])

    def test_login_url_creation(self):
        response = self.client.get('/oauth2/intra/url/login/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('url', response.data)
        self.assertIn(quote(INTRA_LOGIN_REDIRECT_URI), response.data['url'])

    def test_wrong_link_url_creation(self):
        response = self.client.get('/oauth2/intra/url/wrong_case/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class IntraCallbackTests(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.user = User.objects.create_user(
            'tester',
            'test@email.com',
            'password'
        )
        cls.factory = APIRequestFactory()

    # def test_link_callback_success(self):
    #     request = self.factory.get('/oauth2/intra/callback/login/')
    #     force_authenticate(request, user=self.user)
