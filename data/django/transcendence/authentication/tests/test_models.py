from django.test import TestCase
from django.conf import settings

from authentication.models import JwtToken
from authentication.serializers import TokenPairSerializer

from accounts.models import User

from datetime import datetime, timedelta

from rest_framework_simplejwt.exceptions import TokenError


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
