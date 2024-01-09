
from rest_framework.test import APIRequestFactory, APIClient, force_authenticate
from rest_framework import status

from django.test import TestCase
from django.core.exceptions import ValidationError

from accounts.models import User

from oauth2.models import UserIntra


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
