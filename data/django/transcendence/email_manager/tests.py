from uuid import UUID
from django.test import TestCase
from accounts.models import User
from email_manager.models import UserTokens
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

