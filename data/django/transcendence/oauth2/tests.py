
from rest_framework.test import APIRequestFactory, APIClient, force_authenticate
from rest_framework import status

from django.test import TestCase
from django.core.exceptions import ValidationError

from accounts.models import User

from oauth2.models import UserOpenId


class UserOpenIdTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            'tester',
            'tester@email.com',
            'password'
        )
        cls.intra_name = 't-intra'
        cls.intra_email = 't-intra@student.email.com'
        cls.google_name = 't-google'
        cls.google_email = 't-google@gmail.com'

    def test_user_openid_void_creation(self):
        user_openid = UserOpenId.objects.create(self.user)
        self.assertEqual(user_openid.user, self.user)
        self.assertEqual(user_openid.intra_name, '')
        self.assertEqual(user_openid.intra_email, '')
        self.assertEqual(user_openid.google_name, '')
        self.assertEqual(user_openid.google_email, '')

    def test_user_openid_intra_creation(self):
        user_openid = UserOpenId.objects.create(
            self.user,
            intra_name=self.intra_name,
            intra_email=self.intra_email,
        )
        self.assertEqual(user_openid.user, self.user)
        self.assertEqual(user_openid.intra_name, self.intra_name)
        self.assertEqual(user_openid.intra_email, self.intra_email)
        self.assertEqual(user_openid.google_name, '')
        self.assertEqual(user_openid.google_email, '')

    def test_user_openid_google_creation(self):
        user_openid = UserOpenId.objects.create(
            self.user,
            google_name=self.google_name,
            google_email=self.google_email,
        )
        self.assertEqual(user_openid.user, self.user)
        self.assertEqual(user_openid.intra_name, '')
        self.assertEqual(user_openid.intra_email, '')
        self.assertEqual(user_openid.google_name, self.google_name)
        self.assertEqual(user_openid.google_email, self.google_email)

    def test_user_openid_full_creation(self):
        user_openid = UserOpenId.objects.create(
            self.user,
            intra_name=self.intra_name,
            intra_email=self.intra_email,
            google_name=self.google_name,
            google_email=self.google_email,
        )
        self.assertEqual(user_openid.user, self.user)
        self.assertEqual(user_openid.intra_name, self.intra_name)
        self.assertEqual(user_openid.intra_email, self.intra_email)
        self.assertEqual(user_openid.google_name, self.google_name)
        self.assertEqual(user_openid.google_email, self.google_email)

    def test_intra_link(self):
        old_user_openid = UserOpenId.objects.create(
            self.user,
            google_name=self.google_name,
            google_email=self.google_email,
        )
        user_openid = UserOpenId.objects.link_intra(
            old_user_openid,
            intra_name=self.intra_name,
            intra_email=self.intra_email
        )
        self.assertEqual(user_openid.user, self.user)
        self.assertEqual(user_openid.intra_name, self.intra_name)
        self.assertEqual(user_openid.intra_email, self.intra_email)
        self.assertEqual(user_openid.google_name, old_user_openid.google_name)
        self.assertEqual(user_openid.google_email, old_user_openid.google_email)

    def test_google_link(self):
        old_user_openid = UserOpenId.objects.create(
            self.user,
            intra_name=self.intra_name,
            intra_email=self.intra_email,
        )
        user_openid = UserOpenId.objects.link_google(
            old_user_openid,
            google_name=self.google_name,
            google_email=self.google_email,
        )
        self.assertEqual(user_openid.user, self.user)
        self.assertEqual(user_openid.intra_name, old_user_openid.intra_name)
        self.assertEqual(user_openid.intra_email, old_user_openid.intra_email)
        self.assertEqual(user_openid.google_name, self.google_name)
        self.assertEqual(user_openid.google_email, self.google_email)

    def test_intra_unlink(self):
        old_user_openid = UserOpenId.objects.create(
            self.user,
            intra_name=self.intra_name,
            intra_email=self.intra_email,
            google_name=self.google_name,
            google_email=self.google_email,
        )
        user_openid = UserOpenId.objects.unlink_intra(old_user_openid)
        self.assertEqual(user_openid.user, self.user)
        self.assertEqual(user_openid.intra_name, '')
        self.assertEqual(user_openid.intra_email, '')
        self.assertEqual(user_openid.google_name, old_user_openid.google_name)
        self.assertEqual(user_openid.google_email, old_user_openid.google_email)

    def test_google_unlink(self):
        old_user_openid = UserOpenId.objects.create(
            self.user,
            intra_name=self.intra_name,
            intra_email=self.intra_email,
            google_name=self.google_name,
            google_email=self.google_email,
        )
        user_openid = UserOpenId.objects.unlink_google(old_user_openid)
        self.assertEqual(user_openid.user, self.user)
        self.assertEqual(user_openid.intra_name, old_user_openid.intra_name)
        self.assertEqual(user_openid.intra_email, old_user_openid.intra_email)
        self.assertEqual(user_openid.google_name, '')
        self.assertEqual(user_openid.google_email, '')

    def test_unlink_all(self):
        user_openid = UserOpenId.objects.create(
            self.user,
            intra_name=self.intra_name,
            intra_email=self.intra_email,
            google_name=self.google_name,
            google_email=self.google_email,
        )
        user_openid = UserOpenId.objects.unlink_all(user_openid)
        self.assertEqual(user_openid.user, self.user)
        self.assertEqual(user_openid.intra_name, '')
        self.assertEqual(user_openid.intra_email, '')
        self.assertEqual(user_openid.google_name, '')
        self.assertEqual(user_openid.google_email, '')
