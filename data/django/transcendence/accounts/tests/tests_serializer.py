from django.test import TestCase
from django.conf import settings
from accounts.models import User
from accounts.serializers import UserSerializer, UserInfoSerializer, CompleteUserSerializer
from accounts.utils import Roles
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

    # passing all fields valid
    def test_user_serializer_all_fields_valid(self):
        serializer = UserSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.errors, {})
        self.assertEqual(serializer.validated_data, self.data)

    # passing different types of invalid username
    def test_user_serializer_invalid_username(self):
        data = self.data
        for username in self.invalid_usernames:
            data["username"] = username
            serializer = UserSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn("username", serializer.errors)

    # passing different types of invalid emails
    def test_user_serializer_invalid_email(self):
        data = self.data
        for email in self.invalid_emails:
            data["email"] = email
            serializer = UserSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn("email", serializer.errors)

    # passing a valid User object
    def test_user_serializer_valid_user(self):
        user = User(username=self.data["username"],
                    email=self.data["email"],
                    password=self.data["password"])
        user.full_clean()
        serializer = UserSerializer(user)
        data = self.data
        data["active"] = True
        data["verified"] = False
        for key, value in serializer.data.items():
            self.assertEqual(value, data[key])


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
            today.replace(year=(today.year - settings.MIN_AGE)) + timedelta(days=1),
        ]

    # passing all fields valid
    def test_user_info_serializer_all_fields_valid(self):
        serializer = UserInfoSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.errors, {})
        self.assertEqual(serializer.validated_data, self.data)

    # passing different invalid first names
    def test_user_info_serializer_invalid_first_name(self):
        data = self.data
        for first_name in self.invalid_names:
            data["first_name"] = first_name
            serializer = UserInfoSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn("first_name", serializer.errors)

    # passing different invalid last names
    def test_user_info_serializer_invalid_last_name(self):
        data = self.data
        for last_name in self.invalid_names:
            data["last_name"] = last_name
            serializer = UserInfoSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn("last_name", serializer.errors)

    # passing different invalid birthdates
    def test_user_info_serializer_invalid_birthdate(self):
        data = self.data
        for birthdate in self.invalid_dates:
            data["birthdate"] = birthdate
            serializer = UserInfoSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn("birthdate", serializer.errors)


class CompleteUserSerializerTests(TestCase):
    @classmethod
    def setUp(self):
        self.user_data = {
            "username": "tester",
            "email": "test@email.com",
            "password": "password",
            "role": Roles.USER,
        }
        today = date.today()
        self.user_info_data = {
            "first_name": "First test-er",
            "last_name": "Last test-er",
            "birthdate": today.replace(year=today.year - 18)
        }
        self.data = dict(self.user_data)
        self.data["user_info"] = dict(self.user_info_data)
        self.invalid_usernames = ["", "abc", "abcde#", "abcde'", "abcde\"", "abcde" * 7]
        self.invalid_emails = [
            "", "test@emailcom", "testemail.com", "testemailcom",
            "@email.com", "test@.com", "test@email.", "@."
        ]
        self.invalid_roles = ["admin", "mod", "user", "adfa", ""]
        self.expected_user_fields = ["username", "email"]

    # passing all fields (even those not required) valid
    def test_complete_user_serializer_all_fields_valid(self):
        data = self.data
        serializer = CompleteUserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.errors, {})
        self.assertEqual(serializer.validated_data, data)

    # passing only the required fields valid
    def test_complete_user_serializer_with_only_required_fields(self):
        data = self.user_data
        del data["email"]
        del data["password"]
        serializer = CompleteUserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.errors, {})
        self.assertEqual(serializer.validated_data, data)

    # the next 2 tests are here because CompleteUserSerializer
    # doesn't use UserSerializer, so the same checks done in
    # UserSerializer must also be done here

    # passing different invalid usernames
    def test_complete_user_serializer_invalid_username(self):
        data = self.data
        for username in self.invalid_usernames:
            data["username"] = username
            serializer = CompleteUserSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn("username", serializer.errors)

    # passing different types of invalid roles
    def test_complete_user_serializer_invalid_roles(self):
        data = self.data
        for role in self.invalid_roles:
            data["role"] = role
            serializer = CompleteUserSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn("role", serializer.errors)

    # passing different invalid emails
    def test_complete_user_serializer_invalid_email(self):
        data = self.data
        for email in self.invalid_emails:
            data["email"] = email
            serializer = CompleteUserSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn("email", serializer.errors)

    # tests for 'create' method in CompleteUserSerializer

    def test_complete_user_serializer_valid_create_method(self):
        data = self.data
        serializer = CompleteUserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.create(serializer.validated_data)
        self.assertEqual(user.username, self.data["username"])
        self.assertEqual(user.email, self.data["email"])
        user_info = user.user_info
        self.assertEqual(user_info.first_name, self.user_info_data["first_name"])
        self.assertEqual(user_info.last_name, self.user_info_data["last_name"])
        self.assertEqual(user_info.birthdate, self.user_info_data["birthdate"])

    def test_complete_user_serializer_invalid_create_method(self):
        serializer = CompleteUserSerializer()
        for field in self.expected_user_fields:
            data = self.data
            del data[field]
            with self.assertRaises(TypeError):
                serializer.create(data)
        data = self.user_data
        data["new_password"] = "new_password"
        with self.assertRaises(TypeError):
            serializer.create(data)
        data = self.user_data
        data["banned"] = True
        with self.assertRaises(TypeError):
            serializer.create(data)

    def test_complete_user_serializer_valid_update_email_method(self):
        old_user = User.objects.create_user(**self.user_data)
        serializer = CompleteUserSerializer()
        data = dict(self.data)
        data["email"] = "new.test@email.com"
        new_user = serializer.update_email(data)
        self.assertEqual(new_user.email, data["email"])
        self.assertNotEqual(new_user.email, old_user.email)
        user = User.objects.get(pk=old_user.username)
        self.assertEqual(user, new_user)

    def test_complete_user_serializer_valid_update_password_method(self):
        old_user = User.objects.create_user(**self.user_data)
        serializer = CompleteUserSerializer()
        data = self.data
        data["new_password"] = "new_password"
        new_user = serializer.update_password(data)
        self.assertNotEqual(new_user.password, old_user.password)
        user = User.objects.get(pk=new_user.username)
        self.assertEqual(new_user, user)

    def test_complete_user_serializer_invalid_update_password_method(self):
        old_user = User.objects.create_user(**self.user_data)
        serializer = CompleteUserSerializer()
        data = self.data
        with self.assertRaises(ValueError):
            serializer.update_password(data)
        data["new_password"] = self.user_data["password"]
        with self.assertRaises(ValueError):
            serializer.update_password(data)

    def test_complete_user_serializer_valid_update_role_method(self):
        old_user = User.objects.create_user(**self.user_data)
        serializer = CompleteUserSerializer()
        data = self.data
        data["role"] = Roles.MOD
        new_user = serializer.update_role(data)
        self.assertNotEqual(new_user.role, old_user.role)
        user = User.objects.get(pk=new_user.username)
        self.assertEqual(new_user, user)

    def test_complete_user_serializer_invalid_update_role_method(self):
        old_user = User.objects.create_user(**self.user_data)
        serializer = CompleteUserSerializer()
        data = {}
        for invalid_role in self.invalid_roles:
            data["username"] = old_user.username
            data["role"] = invalid_role
            with self.assertRaises(ValueError):
                serializer.update_role(data)

    def test_complete_user_serializer_valid_update_active_method(self):
        old_user = User.objects.create_user(**self.user_data)
        serializer = CompleteUserSerializer()
        data = self.data
        data["banned"] = True
        new_user = serializer.update_active(data)
        self.assertNotEqual(new_user.active, old_user.active)
        user = User.objects.get(pk=new_user.username)
        self.assertEqual(new_user, user)

    def test_complete_user_serializer_invalid_update_active_method(self):
        old_user = User.objects.create_user(**self.user_data)
        serializer = CompleteUserSerializer()
        data = self.data
        data["role"] = Roles.MOD
        new_user = serializer.update_role(data)
        with self.assertRaises(ValueError):
            serializer.update_active( {"username": new_user.username, "banned": True} )

    def test_complete_user_serializer_role_security_method(self):
        data = self.data
        data["role"] = Roles.ADMIN
        serializer = CompleteUserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.create(serializer.validated_data)
        self.assertEqual(user.username, self.data["username"])
        self.assertEqual(user.email, self.data["email"])
        self.assertEqual(user.role, Roles.USER)
        user_info = user.user_info
        self.assertEqual(user_info.first_name, self.user_info_data["first_name"])
        self.assertEqual(user_info.last_name, self.user_info_data["last_name"])
        self.assertEqual(user_info.birthdate, self.user_info_data["birthdate"])
