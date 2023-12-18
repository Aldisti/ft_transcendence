from datetime import date, timedelta
from django.test import TestCase
from accounts.models import User
from accounts.models import UserInfo
from accounts.utils import Roles
from django.core.exceptions import ValidationError


# Create your tests here.

class ModelUserTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.username = "gpanico"
        cls.super_username = "admin"
        cls.invalid_username = "Giovanni#@#$!"
        cls.short_username = "Gi"
        cls.email = "giovanni@gmail.com"
        cls.super_email = "admin@gmail.com"
        cls.new_email = "giovanni2@gmail.com"
        cls.invalid_email = "giovannigmail.com"
        cls.password = "prova"
        cls.new_password = "password"
        cls.user = User.objects.create_user("gpanico", "giovanni@gmail.com", "prova")
        cls.superuser = User.objects.create_superuser("admin", "admin@gmail.com", "prova")

    def test_valid_user_creation(self):
        self.assertEqual(self.user.email, self.email)
        self.assertEqual(self.user.username, self.username)
        self.assertTrue(self.user.active)
        self.assertEqual(self.user.role, Roles.USER)

    def test_email_update(self):
        # not passing password to update function
        with self.assertRaises(ValueError):
            User.objects.update_user_email(self.user, email=self.new_email)
        # not passing email to update function
        with self.assertRaises(ValueError):
            User.objects.update_user_email(self.user, password=self.password)
        # passing the same email to update function
        with self.assertRaises(ValueError):
            User.objects.update_user_email(self.user, password=self.password, email=self.email)
        # passing invalid email to update function
        with self.assertRaises(ValidationError):
            User.objects.update_user_email(self.user, password=self.password, email=self.invalid_email)
        # passing invalid password to update function
        with self.assertRaises(ValueError):
            User.objects.update_user_email(self.user, password=self.new_password, email=self.new_email)
        # passing new email to update function
        self.user = User.objects.update_user_email(self.user, password=self.password, email=self.new_email)
        self.assertEqual(self.user.email, self.new_email)

    def test_password_update(self):
        # not passing old password to update function
        with self.assertRaises(ValueError):
            User.objects.update_user_password(self.user, new_password=self.new_password)
        # not passing new password to update function
        with self.assertRaises(ValueError):
            User.objects.update_user_password(self.user, password=self.password)
        # passing the old password as new password to update function
        with self.assertRaises(ValueError):
            User.objects.update_user_password(self.user, password=self.password, new_password=self.password)
        # passing invalid old password to update function
        with self.assertRaises(ValueError):
            User.objects.update_user_password(self.user, password=self.new_password, new_password=self.new_password)
        # passing new password to update function
        self.user = User.objects.update_user_password(self.user, password=self.password, new_password=self.new_password)
        self.assertTrue(self.user.check_password(self.new_password))

    def test_invalid_user_creation(self):
        # checking creation without values
        with self.assertRaises(TypeError):
            User.objects.create_user()
        # checking creation with partial values
        with self.assertRaises(TypeError):
            User.objects.create_user(email=self.email, username=self.username)
        # checking creation with invalid self.email
        with self.assertRaises(ValidationError):
            User.objects.create_user(self.username, self.invalid_email, self.password)
        # checking creation with blank username
        with self.assertRaises(ValidationError):
            User.objects.create_user("", self.email, self.password)
        # checking creation with invalid username
        with self.assertRaises(ValidationError):
            User.objects.create_user(self.invalid_username, self.email, self.password)
        # checking creation with short username
        with self.assertRaises(ValidationError):
            User.objects.create_user(self.short_username, self.email, self.password)

    def test_user_delete(self):
        self.user.delete()
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(pk=self.username)

    def test_valid_superuser_creation(self):
        self.assertEqual(self.superuser.email, self.super_email)
        self.assertEqual(self.superuser.username, self.super_username)
        self.assertTrue(self.superuser.active)
        self.assertEqual(self.superuser.role, Roles.ADMIN)

    def test_superuser_delete(self):
        self.superuser.delete()
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(pk=self.super_username)

    def test_invalid_superuser_creation(self):
        # checking creation without values
        with self.assertRaises(TypeError):
            User.objects.create_superuser()
        # checking creation with partial values
        with self.assertRaises(TypeError):
            User.objects.create_superuser(email=self.super_email, username=self.super_username)
        # checking creation with invalid self.email
        with self.assertRaises(ValidationError):
            User.objects.create_superuser(self.super_username, self.invalid_email, self.password)
        # checking creation with role user
        with self.assertRaises(ValueError):
            User.objects.create_superuser(self.super_username, self.super_email, self.password, role=Roles.USER)
        # checking creation with role mod
        with self.assertRaises(ValueError):
            User.objects.create_superuser(self.super_username, self.super_email, self.password, role=Roles.MOD)
        # checking creation with blank username
        with self.assertRaises(ValidationError):
            User.objects.create_superuser("", self.super_email, self.password)
        # checking creation with invalid username
        with self.assertRaises(ValidationError):
            User.objects.create_superuser(self.invalid_username, self.super_email, self.password)


class ModelUserInfoTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user("Giovanni", "g@mail.com", "password")
        cls.first_name = "Giovanni"
        cls.last_name = "Panico"
        cls.birthdate = date(1999, 5, 21)
        cls.picture = "ciao"
        cls.invalid_first_name = "Giovanni#@!"
        cls.invalid_last_name = "Panico#@!"
        today = date.today()
        cls.too_young_birthdate = today.replace(year=(today.year - 14)) + timedelta(days=1)
        cls.too_old_birthdate = date(1899, 12, 31)

    def test_valid_user_info_create(self):
        user_info = UserInfo.objects.create(self.user, first_name=self.first_name,
                                            last_name=self.last_name, birthdate=self.birthdate,
                                            picture=self.picture)
        self.assertEqual(user_info.first_name, self.first_name)
        self.assertEqual(user_info.last_name, self.last_name)
        self.assertEqual(user_info.birthdate, self.birthdate)
        self.assertEqual(user_info.picture, self.picture)

    def test_blank_user_info_create(self):
        user_info = UserInfo.objects.create(self.user)
        self.assertEqual(user_info.first_name, "")
        self.assertEqual(user_info.last_name, "")
        self.assertEqual(user_info.birthdate, None)
        self.assertEqual(user_info.picture, None)

    def test_invalid_user_info_create(self):
        # checking creation with invalid first_name
        with self.assertRaises(ValidationError):
            UserInfo.objects.create(self.user, first_name=self.invalid_first_name)
        # checking creation with invalid last_name
        with self.assertRaises(ValidationError):
            UserInfo.objects.create(self.user, first_name=self.invalid_last_name)
        # checking creation with birthdate less than 14
        with self.assertRaises(ValidationError):
            UserInfo.objects.create(self.user, first_name=self.too_young_birthdate)
        # checking creation with birthdate older than 1900/01/01
        with self.assertRaises(ValidationError):
            UserInfo.objects.create(self.user, first_name=self.too_old_birthdate)

    def test_valid_user_info_update(self):
        user_info = UserInfo.objects.create(self.user)
        user_info = UserInfo.objects.update_info(user_info,
                                                 first_name=self.first_name,
                                                 last_name=self.last_name,
                                                 birthdate=self.birthdate,
                                                 picture=self.picture
                                                 )
        self.assertEqual(user_info.first_name, self.first_name)
        self.assertEqual(user_info.last_name, self.last_name)
        self.assertEqual(user_info.birthdate, self.birthdate)
        self.assertEqual(user_info.picture, self.picture)

    def test_invalid_user_info_update(self):
        user_info = UserInfo.objects.create(self.user)
        # checking creation with invalid first_name
        with self.assertRaises(ValidationError):
            UserInfo.objects.update_info(user_info, first_name=self.invalid_first_name)
        # checking creation with invalid last_name
        with self.assertRaises(ValidationError):
            UserInfo.objects.update_info(user_info, first_name=self.invalid_last_name)
        # checking creation with birthdate less than 14
        with self.assertRaises(ValidationError):
            UserInfo.objects.update_info(user_info, first_name=self.too_young_birthdate)
        # checking creation with birthdate older than 1900/01/01
        with self.assertRaises(ValidationError):
            UserInfo.objects.update_info(user_info, first_name=self.too_old_birthdate)
