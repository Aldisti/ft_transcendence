
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APITestCase

from .models import User, Roles
from .serializers import UserSerializer


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
        cls.user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
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
        self.assertFalse(user.active)
        # sban User
        user = User.objects.update_active(self.user, status=False)
        self.assertTrue(user.active)

    def test_user_verified_update(self):
        # User verification
        user = User.objects.update_verified(self.user, status=True)
        self.assertTrue(user.verified)
        user = User.objects.update_verified(self.user, status=False)
        self.assertFalse(user.verified)

    def test_invalid_user_creation(self):
        # checking creation without values
        with self.assertRaises(TypeError):
            User.objects.create_user()
        # checking creation with partial values
        with self.assertRaises(TypeError):
            User.objects.create_user(email=self.email, username=self.username)
        # checking creation with invalid self.email
        with self.assertRaises(ValidationError):
            User.objects.create_user(username=self.username, email=self.invalid_email, password=self.password)
        # checking creation with blank username
        with self.assertRaises(ValueError):
            User.objects.create_user(username="", email=self.email, password=self.password)
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
        with self.assertRaises(ValueError):
            User.objects.create_superuser("", self.super_email, self.password)
        # checking creation with invalid username
        with self.assertRaises(ValidationError):
            User.objects.create_superuser(self.invalid_username, self.super_email, self.password)


class UsersViewsTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        usernames = [f"tester{i}" for i in range(1, 5)]
        emails = [f"{username}@localhost" for username in usernames]
        password = 'password'
        new_password = 'new_password'
        cls.usernames = usernames
        cls.emails = emails
        cls.password = password
        cls.new_password = new_password
        cls.superuser = User.objects.create_superuser(
            username=usernames[0],
            email=emails[0],
            password=password
        )

    def setUp(self):
        self.user = User.objects.create_user(
            username=self.usernames[2],
            email=self.emails[2],
            password=self.password,
        )

    def test_valid_register_user(self):
        data = {
            'username': self.usernames[1],
            'email': self.emails[1],
            'password': self.password,
        }
        response = self.client.post(reverse('register'), data)
        self.assertEqual(response.status_code, 201)
        data.pop('password', '')
        self.assertNumQueries(
            num=1,
            func=User.objects.get,
            **data,
        )

    def test_invalid_register_user(self):
        invalid_data = [{
            'username': self.usernames[1],
            'password': self.password,
        }, {
            'email': self.emails[1],
            'password': self.password,
        }, {
            'username': self.usernames[1],
            'email': self.emails[1],
        }, {
            'username': self.usernames[0],
            'email': self.emails[1],
            'password': self.password,
        }, {
            'username': self.usernames[1],
            'email': self.emails[0],
            'password': self.password,
        }]
        for data in invalid_data:
            response = self.client.post(reverse('register'), data)
            self.assertEqual(response.status_code, 400)
            with self.assertRaises(User.DoesNotExist):
                User.objects.get(username=self.usernames[1])
            with self.assertRaises(User.DoesNotExist):
                User.objects.get(email=self.emails[1])

    def test_delete_user(self):
        user = self.user
        self.client.force_authenticate(user)
        response = self.client.delete(
            reverse('delete_user') + f"?username={user.username}",
        )
        self.assertEqual(response.status_code, 200)
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(username=user.username, email=user.email)

    def test_valid_change_role(self):
        user = self.user
        self.client.force_authenticate(self.superuser)
        # test role change from User to Mod
        response = self.client.patch(
            reverse('change_role'),
            {'username': user.username, 'role': Roles.MOD},
        )
        self.assertEqual(response.status_code, 200)
        user = User.objects.get(username=user.username)
        self.assertEqual(user.role, Roles.MOD)
        # test role change from Mod to User
        response = self.client.patch(
            reverse('change_role'),
            {'username': user.username, 'role': Roles.USER},
        )
        self.assertEqual(response.status_code, 200)
        user = User.objects.get(username=user.username)
        self.assertEqual(user.role, Roles.USER)

    def test_invalid_change_role(self):
        user = self.user
        self.client.force_authenticate(self.superuser)
        # test role change from Admin to Mod
        response = self.client.patch(
            reverse('change_role'),
            {'username': self.superuser.username, 'role': Roles.MOD}
        )
        self.assertEqual(response.status_code, 400)
        superuser = User.objects.get(username=self.superuser.username)
        self.assertEqual(superuser.role, Roles.ADMIN)
        # test role change from User to Admin
        response = self.client.patch(
            reverse('change_role'),
            {'username': user.username, 'role': Roles.ADMIN},
        )
        self.assertEqual(response.status_code, 400)
        user = User.objects.get(username=user.username)
        self.assertEqual(user.role, Roles.USER)

    def test_valid_update_password(self):
        user = self.user
        self.client.force_authenticate(user)
        response = self.client.patch(
            reverse('update_password'),
            {'password': self.password, 'new_password': self.new_password}
        )
        self.assertEqual(response.status_code, 200)
        user = User.objects.get(username=user.username)
        self.assertTrue(user.check_password(self.new_password))

    def test_invalid_update_password(self):
        user = self.user
        cases = [
            {'password': self.new_password, 'new_password': self.new_password},
            {'password': self.password, 'new_password': self.password},
            {'new_password': self.new_password},
            {'password': self.password},
        ]
        self.client.force_authenticate(user)
        for case in cases:
            response = self.client.patch(reverse('update_password'), case)
            self.assertEqual(response.status_code, 400)
            user = User.objects.get(username=user.username)
            self.assertTrue(user.check_password(self.password))

    def test_valid_update_username(self):
        user = self.user
        self.client.force_authenticate(user)
        response = self.client.patch(
            reverse('update_username'),
            {'username': self.usernames[3], 'password': self.password}
        )
        self.assertEqual(response.status_code, 200)
        user = User.objects.get(email=user.email)
        self.assertEqual(user.username, self.usernames[3])
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(username=self.usernames[2])

    def test_invalid_update_username(self):
        user = self.user
        cases = [
            {'username': user.username, 'password': self.password},
            {'username': self.usernames[3], 'password': self.new_password},
            {'username': self.usernames[3], 'password': self.new_password},
        ]
        self.client.force_authenticate(user)
        for case in cases:
            response = self.client.patch(reverse('update_username'), case)
            self.assertEqual(response.status_code, 400)
            user = User.objects.get(username=user.username)

    def test_valid_update_email(self):
        user = self.user
        self.client.force_authenticate(user)
        response = self.client.patch(
            reverse('update_email'),
            {'email': self.emails[3], 'password': self.password},
        )
        self.assertEqual(response.status_code, 200)
        user = User.objects.get(email=user.email)
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(email=self.emails[2])

    def test_invalid_update_email(self):
        user = self.user
        cases = [
            {'email': user.email, 'password': self.password},
            {'email': self.emails[3], 'password': self.new_password},
            {'email': self.emails[3]},
        ]
        self.client.force_authenticate(user)
        for case in cases:
            response = self.client.patch(reverse('update_email'), case)
            self.assertEqual(response.status_code, 400)
            user = User.objects.get(email=self.emails[2])

    def test_valid_change_active(self):
        user = self.user
        self.client.force_authenticate(self.superuser)
        response = self.client.patch(
            reverse('change_active'),
            {'username': user.username, 'banned': True},
        )
        self.assertEqual(response.status_code, 200)
        user = User.objects.get(username=user.username)
        self.assertFalse(user.active)

    def test_invalid_change_active(self):
        user = self.user
        # test update active to admin
        self.client.force_authenticate(self.superuser)
        response = self.client.patch(
            reverse('change_active'),
            {'username': self.superuser.username, 'banned': True},
        )
        self.assertEqual(response.status_code, 400)
        superuser = User.objects.get(username=self.superuser.username)
        self.assertTrue(superuser.active)
        # test update active without being a moderator
        self.client.force_authenticate(user)
        response = self.client.patch(
            reverse('change_active'),
            {'username': user.username, 'banned': True},
        )
        self.assertEqual(response.status_code, 403)
        user = User.objects.get(username=user.username)
        self.assertTrue(user.active)

    def test_get_user(self):
        user = self.user
        self.client.force_authenticate(user)
        response = self.client.get(reverse('get_user', kwargs={'username': user.username}))
        self.assertEqual(response.status_code, 200)
        user_serializer = UserSerializer(user)
        self.assertEqual(user_serializer.data, response.data)

