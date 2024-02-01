
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.test import TestCase

from .models import User, Roles


class ModelUserTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        username = "tester"
        cls.username = username
        super_username = "admin"
        cls.super_username = super_username
        cls.invalid_username = "tester#@#$!"
        cls.short_username = "te"
        email = "tester@email.com"
        cls.email = email
        super_email = "admin@email.com"
        cls.super_email = super_email
        cls.new_email = "new_tester@email.com"
        cls.invalid_email = "testeremail.com"
        password = "old_password"
        cls.password = password
        cls.new_password = "new_password"
        cls.invalid_role = "UA"
        cls.role = "M"
        cls.user = User.objects.create_user(username, email, password)
        cls.superuser = User.objects.create_superuser(super_username, super_email, password)

    def test_valid_user_creation(self):
        self.assertEqual(self.user.email, self.email)
        self.assertEqual(self.user.username, self.username)
        self.assertTrue(self.user.active)
        self.assertFalse(self.user.verified)
        self.assertEqual(self.user.role, Roles.USER)

    def test_email_update(self):
        # not passing password to update function
        with self.assertRaises(ValueError):
            User.objects.update_email(self.user, email=self.new_email)
        print()
        # not passing email to update function
        with self.assertRaises(ValueError):
            User.objects.update_email(self.user, password=self.password)
        # passing the same email to update function
        with self.assertRaises(ValueError):
            User.objects.update_email(self.user, password=self.password, email=self.email)
        # passing invalid email to update function
        with self.assertRaises(ValidationError):
            User.objects.update_email(self.user, password=self.password, email=self.invalid_email)
        # passing invalid password to update function
        with self.assertRaises(ValueError):
            User.objects.update_email(self.user, password=self.new_password, email=self.new_email)
        # passing new email to update function
        self.user = User.objects.update_email(self.user, password=self.password, email=self.new_email)
        self.assertEqual(self.user.email, self.new_email)

    def test_password_update(self):
        # not passing old password to update function
        with self.assertRaises(ValueError):
            User.objects.update_password(self.user, new_password=self.new_password)
        # not passing new password to update function
        with self.assertRaises(ValueError):
            User.objects.update_password(self.user, password=self.password)
        # passing the old password as new password to update function
        with self.assertRaises(ValueError):
            User.objects.update_password(self.user, password=self.password, new_password=self.password)
        # passing invalid old password to update function
        with self.assertRaises(ValueError):
            User.objects.update_password(self.user, password=self.new_password, new_password=self.new_password)
        # passing new password to update function
        self.user = User.objects.update_password(self.user, password=self.password, new_password=self.new_password)
        self.assertTrue(self.user.check_password(self.new_password))

    def test_password_reset(self):
        # passing blank new password to reset function
        with self.assertRaises(ValueError):
            User.objects.reset_password(self.user, password="")
        # passing the old password as new password
        with self.assertRaises(ValueError):
            User.objects.reset_password(self.user, password=self.password)
        # passing new password to reset function
        self.user = User.objects.reset_password(self.user, password=self.new_password)
        self.assertTrue(self.user.check_password(self.new_password))

    def test_role_update(self):
        # passing invalid role
        with self.assertRaises(ValueError):
            User.objects.update_role(self.user, role=self.invalid_role)
        # passing blank role
        with self.assertRaises(ValueError):
            User.objects.update_role(self.user, role="")
        # passing the same role
        old_role = self.user.role
        user = User.objects.update_role(self.user, role=old_role)
        self.assertEqual(old_role, user.role)
        # passing valid role
        user = User.objects.update_role(self.user, role=self.role)
        self.assertEqual(self.role, user.role)
        # passing the old role
        user = User.objects.update_role(self.user, role=old_role)
        self.assertEqual(old_role, user.role)

    def test_user_active_update(self):
        # ban User
        user = User.objects.update_active(self.user, status=True)
        self.assertTrue(user.active)
        # sban User
        user = User.objects.update_active(self.user, status=False)
        self.assertFalse(user.active)

    def test_user_verified_update(self):
        # User verification
        user = User.objects.update_verified(self.user, status=True)
        self.assertTrue(user.verified)
        user = User.objects.update_verified(self.user, status=False)
        self.assertFalse(user.verified)

    def test_user_tfa_update(self):
        # User verification
        user = User.objects.update_tfa(self.user, status=True)
        self.assertTrue(user.tfa)
        user = User.objects.update_tfa(self.user, status=False)
        self.assertFalse(user.tfa)

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
        with self.assertRaises(ObjectDoesNotExist):
            User.objects.get(username=self.username)

    def test_valid_superuser_creation(self):
        self.assertEqual(self.superuser.email, self.super_email)
        self.assertEqual(self.superuser.username, self.super_username)
        self.assertTrue(self.superuser.active)
        self.assertTrue(self.superuser.verified)
        self.assertEqual(self.superuser.role, Roles.ADMIN)

    def test_superuser_active_update(self):
        # ban superuser
        with self.assertRaises(ValueError):
            superuser = User.objects.update_active(self.superuser, status=True)
        with self.assertRaises(ValueError):
            superuser = User.objects.update_active(self.superuser, status=False)

    def test_superuser_verified_update(self):
        # change superuser verification
        with self.assertRaises(ValueError):
            superuser = User.objects.update_verified(self.superuser, status=False)
        with self.assertRaises(ValueError):
            superuser = User.objects.update_verified(self.superuser, status=True)

    def test_superuser_delete(self):
        self.superuser.delete()
        with self.assertRaises(ObjectDoesNotExist):
            User.objects.get(username=self.super_username)

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
