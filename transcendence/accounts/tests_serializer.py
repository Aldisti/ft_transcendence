from datetime import date, timedelta
from django.test import TestCase

from accounts.models import User, UserInfo
from accounts.serializers import UserSerializer, UserInfoSerializer, CompleteUserSerializer
from django.core.exceptions import ValidationError


class UserSerializerTestCase(TestCase):
    def setUpTestData(cls):
        cls.user = User.objects.create(username='tester', email='test@email.com', password='password')
        cls.user_info = UserInfo.objects.create(user=cls.user, first_name='first_test', last_name='last_test')
        cls.invalid_usernames = ["", "abc", "abcde#", "abcde'", "abcde\"", "abcde" * 7]
        cls.invalid_emails = [
            "", "test@emailcom", "testemail.com", "testemailcom",
            "@email.com", "test@.com", "test@email.", "@."
        ]

    def test_user_serializer_all_fields_valid(self):
        serializer = UserSerializer(data={
            "username": self.user.username,
            "email": self.user.email,
            "password": self.user.password,
        })
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data, {'username': self.user.username, 'email': self.user})

    def test_user_serializer_invalid_username(self):
        for username in self.invalid_usernames:
            serializer = UserSerializer(data={
                "username": username,
                "email": self.user.email,
                "password": self.user.password,
            })
            self.assertFalse(serializer.is_valid())
            self.assertIn("username", serializer.errors)

    def test_user_serializer_invalid_email(self):
        for email in self.invalid_emails:
            serializer = UserSerializer(data={
                "username": self.user.username,
                "email": email,
                "password": self.user.password,
            })
            self.assertFalse(serializer.is_valid())
            self.assertIn("email", serializer.errors)
