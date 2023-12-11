from datetime import date, timedelta
from django.test import TestCase
from accounts.models import User
from accounts.utils import Roles
from django.core.exceptions import ValidationError

# Create your tests here.

class ModelUserTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.username = "Giovanni!?*@$~_-"
        cls.invalid_username = "Giovanni#@#$!"
        cls.email = "giovanni@gmail.com"
        cls.invalid_email = "giovannigmail.com"
        cls.password = "prova"

    def test_valid_user_creation(self):
        user = User.objects.create_user(self.username, self.email, self.password)
        self.assertEqual(user.email, self.email)
        self.assertEqual(user.username, self.username)
        self.assertTrue(user.active)
        self.assertEqual(user.role, Roles.USER)

    def test_user_delete(self):
        user = User.objects.create_user(self.username, self.email, self.password)
        user.delete()
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(pk=self.username)


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

    def test_valid_superuser_creation(self):
        user = User.objects.create_superuser(self.username, self.email, self.password)
        self.assertEqual(user.email, self.email)
        self.assertEqual(user.username, self.username)
        self.assertTrue(user.active)
        self.assertEqual(user.role, Roles.ADMIN)

    def test_superuser_delete(self):
        admin = User.objects.create_superuser(self.username, self.email, self.password)
        admin.delete()
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(pk=self.username)

    def test_invalid_superuser_creation(self):
        # checking creation without values
        with self.assertRaises(TypeError):
            User.objects.create_superuser()
        # checking creation with partial values
        with self.assertRaises(TypeError):
            User.objects.create_superuser(email=self.email, username=self.username)
        # checking creation with invalid self.email
        with self.assertRaises(ValidationError):
            User.objects.create_superuser(self.username, self.invalid_email, self.password)
        # checking creation with role user
        with self.assertRaises(ValueError):
            User.objects.create_superuser(self.username, self.email, self.password, role=Roles.USER)
        # checking creation with role mod
        with self.assertRaises(ValueError):
            User.objects.create_superuser(self.username, self.email, self.password, role=Roles.MOD)
        # checking creation with blank username
        with self.assertRaises(ValidationError):
            User.objects.create_superuser("", self.email, self.password)
        # checking creation with invalid username
        with self.assertRaises(ValidationError):
            User.objects.create_superuser(self.invalid_username, self.email, self.password)

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
        user_info = User.objects.add_user_info(self.user.username, first_name=self.first_name,
                                               last_name=self.last_name, birthdate=self.birthdate,
                                               picture=self.picture)
        self.assertEqual(user_info.first_name, self.first_name);
        self.assertEqual(user_info.last_name, self.last_name);
        self.assertEqual(user_info.birthdate, self.birthdate);
        self.assertEqual(user_info.picture, self.picture);

    def test_blank_user_info_create(self):
        user_info = User.objects.add_user_info(self.user.username)
        self.assertEqual(user_info.first_name, "");
        self.assertEqual(user_info.last_name, "");
        self.assertEqual(user_info.birthdate, None);
        self.assertEqual(user_info.picture, None);

    def test_invalid_user_info_create(self):
        # checking creation with invalid first_name
        with self.assertRaises(ValidationError):
            User.objects.add_user_info(self.user.username, first_name=self.invalid_first_name)
        # checking creation with invalid last_name
        with self.assertRaises(ValidationError):
            User.objects.add_user_info(self.user.username, first_name=self.invalid_last_name)
        # checking creation with birthdate less than 14
        with self.assertRaises(ValidationError):
            User.objects.add_user_info(self.user.username, first_name=self.too_young_birthdate)
        # checking creation with birthdate older than 1900/01/01
        with self.assertRaises(ValidationError):
            User.objects.add_user_info(self.user.username, first_name=self.too_old_birthdate)

    def test_valid_user_info_update(self):
        user_info = User.objects.add_user_info(self.user.username)
        user_info = User.objects.update_user_info(self.user.username,
                                                  first_name=self.first_name,
                                                  last_name=self.last_name,
                                                  birthdate=self.birthdate,
                                                  picture=self.picture)
        self.assertEqual(user_info.first_name, self.first_name);
        self.assertEqual(user_info.last_name, self.last_name);
        self.assertEqual(user_info.birthdate, self.birthdate);
        self.assertEqual(user_info.picture, self.picture);

    def test_invalid_user_info_update(self):
        user_info = User.objects.add_user_info(self.user.username)
        # checking creation with invalid first_name
        with self.assertRaises(ValidationError):
            User.objects.update_user_info(self.user.username, first_name=self.invalid_first_name)
        # checking creation with invalid last_name
        with self.assertRaises(ValidationError):
            User.objects.update_user_info(self.user.username, first_name=self.invalid_last_name)
        # checking creation with birthdate less than 14
        with self.assertRaises(ValidationError):
            User.objects.update_user_info(self.user.username, first_name=self.too_young_birthdate)
        # checking creation with birthdate older than 1900/01/01
        with self.assertRaises(ValidationError):
            User.objects.update_user_info(self.user.username, first_name=self.too_old_birthdate)
