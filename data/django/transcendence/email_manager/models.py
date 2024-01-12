from uuid import uuid4
from django.db import models
from django.core import validators
from accounts.models import User

# Mangers


class UserTokensManger(models.Manager):
    def create(self, user: User):
        user_tokens = self.model(user=user)
        user_tokens.full_clean()
        user_tokens.save()
        return user_tokens

    def clear_email_token(self, user_tokens):
        user_tokens.email_token = ""
        user_tokens.full_clean()
        user_tokens.save()
        return user_tokens

    def generate_email_token(self, user_tokens):
        token = uuid4()
        user_tokens.email_token = str(token)
        user_tokens.full_clean()
        user_tokens.save()
        return user_tokens

    def clear_password_token(self, user_tokens):
        user_tokens.password_token = ""
        user_tokens.full_clean()
        user_tokens.save()
        return user_tokens

    def generate_password_token(self, user_tokens):
        token = uuid4()
        user_tokens.password_token = str(token)
        user_tokens.full_clean()
        user_tokens.save()
        return user_tokens


# Create your models here.


class UserTokens(models.Model):
    user = models.OneToOneField(
        to=User,
        on_delete=models.CASCADE,
        related_name="user_tokens",
        db_column="username",
        primary_key=True
    )
    email_token = models.CharField(
        db_column="email_token",
        max_length=36,
        blank=True,
        default="",
        validators=[validators.MinLengthValidator(36, message="Too short token")]
    )
    password_token = models.CharField(
        db_column="password_token",
        max_length=36,
        blank=True,
        default="",
        validators=[validators.MinLengthValidator(36, message="Too short token")]
    )

    objects = UserTokensManger()

    def is_resetting_password(self):
        return self.password_token != ""

    class Meta:
        db_table = "user_tokens"

    def __str__(self):
        return f"user: {self.user.username}, email_token: {self.email_token}"

