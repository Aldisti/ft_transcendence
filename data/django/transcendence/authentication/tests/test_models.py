from django.test import TestCase
from django.conf import settings

from authentication.models import JwtToken, UserTokens
from authentication.serializers import TokenPairSerializer

from accounts.models import User

from datetime import datetime, timedelta

from rest_framework_simplejwt.exceptions import TokenError
from uuid import UUID
from django.core.exceptions import ValidationError

# Create your tests here.


class UserTokensTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.username = "gpanico"
        cls.email = "gpanico@gmail.com"
        cls.password = "prova"
        cls.user = User.objects.create_user("gpanico", "gpanico@gmail.com", "prova")

    def test_valid_user_tokens_creation(self):
        user_tokens = UserTokens.objects.create(user=self.user)
        self.assertEqual(user_tokens.user, self.user)
        self.assertEqual(user_tokens.email_token, "")

    def test_invalid_user_tokens_create(self):
        #not_saved_user = User(username=self.username, email=self.email, password=self.password)
        with self.assertRaises(TypeError):
            user_tokens = UserTokens.objects.create()

    def test_double_user_tokens_creation(self):
        user_tokens = UserTokens.objects.create(user=self.user)
        with self.assertRaises(ValidationError):
            user_tokens = UserTokens.objects.create(user=self.user)

    def test_generate_email_token(self):
        user_tokens = UserTokens.objects.create(user=self.user)
        user_tokens = UserTokens.objects.generate_email_token(user_tokens)
        self.assertEqual(len(user_tokens.email_token), 36)
        # test if the uuid is well formed
        UUID(user_tokens.email_token)

    def test_clear_email_token(self):
        user_tokens = UserTokens.objects.create(user=self.user)
        user_tokens = UserTokens.objects.generate_email_token(user_tokens)
        user_tokens = UserTokens.objects.clear_email_token(user_tokens)
        self.assertEqual(user_tokens.email_token, "")

    def test_generate_password_token(self):
        user_tokens = UserTokens.objects.create(user=self.user)
        user_tokens = UserTokens.objects.generate_password_token(user_tokens)
        self.assertEqual(len(user_tokens.password_token), 36)
        # test if the uuid is well formed
        UUID(user_tokens.password_token)

    def test_clear_password_token(self):
        user_tokens = UserTokens.objects.create(user=self.user)
        user_tokens = UserTokens.objects.generate_password_token(user_tokens)
        user_tokens = UserTokens.objects.clear_password_token(user_tokens)
        self.assertEqual(user_tokens.password_token, "")


class JwtTokenManagerTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        user = User.objects.create_user(
            username="tester",
            email="test@email.com",
            password="password",
        )
        cls.user = user
        token = TokenPairSerializer.get_token(user)
        cls.token = token
        invalid_token = TokenPairSerializer.get_token(user)
        invalid_token.set_exp(
            # TODO: remove tz
            from_time=datetime.now(tz=settings.TZ) - timedelta(days=2),
            lifetime=timedelta(days=1)
        )
        cls.invalid_token = invalid_token

    def test_valid_token_creation(self):
        jwt_token = JwtToken.objects.create(self.token)
        self.assertEqual(jwt_token.token, self.token['csrf'])

    def test_invalid_token_creation(self):
        with self.assertRaises(TokenError):
            JwtToken.objects.create(None)
        with self.assertRaises(TokenError):
            JwtToken.objects.create(self.invalid_token)
