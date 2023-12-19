from django.test import TestCase
from accounts.serializers import UserSerializer, UserInfoSerializer, CompleteUserSerializer
from accounts.validators import MIN_AGE
from datetime import date, timedelta


class UserSerializerTests(TestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        cls.data = {
            "username": "tester",
            "email": "test@gmail.com",
            "password": "password",
        }
        cls.invalid_usernames = ["", "abc", "abcde#", "abcde'", "abcde\"", "abcde" * 7]
        cls.invalid_emails = [
            "", "test@emailcom", "testemail.com", "testemailcom",
            "@email.com", "test@.com", "test@email.", "@."
        ]

    def test_user_serializer_all_fields_valid(self):
        serializer = UserSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data, self.data)

    def test_user_serializer_invalid_username(self):
        data = self.data
        for username in self.invalid_usernames:
            data["username"] = username
            serializer = UserSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn("username", serializer.errors)

    def test_user_serializer_invalid_email(self):
        data = self.data
        for email in self.invalid_emails:
            data["email"] = email
            serializer = UserSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn("email", serializer.errors)


class UserInfoSerializerTests(TestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        today = date.today()
        cls.data = {
            "first_name": "First Test-er",
            "last_name": "Last Test-er",
            "birthdate": today.replace(year=today.year - 18),
        }
        cls.invalid_names = ["tester@", "tester!", "test_er", "tester\'", "tester\"", "tester" * 6]
        cls.invalid_dates = [
            today.replace(year=1899),
            today,
            today + timedelta(days=1),
            today.replace(year=(today.year - MIN_AGE)) + timedelta(days=1),
        ]

    def test_user_info_serializer_all_fields_valid(self):
        serializer = UserInfoSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data, self.data)

    def test_user_info_serializer_invalid_first_name(self):
        data = self.data
        for first_name in self.invalid_names:
            data["first_name"] = first_name
            serializer = UserInfoSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn("first_name", serializer.errors)

    def test_user_info_serializer_invalid_last_name(self):
        data = self.data
        for last_name in self.invalid_names:
            data["last_name"] = last_name
            serializer = UserInfoSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn("last_name", serializer.errors)

    def test_user_info_serializer_invalid_birthdate(self):
        data = self.data
        for birthdate in self.invalid_dates:
            data["birthdate"] = birthdate
            serializer = UserInfoSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn("birthdate", serializer.errors)

