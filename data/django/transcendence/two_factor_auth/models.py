from django.contrib.auth.base_user import BaseUserManager
from django.core.validators import MinLengthValidator
from django.db import models

from accounts.models import User

from pyotp import random_base32
from uuid import uuid4


class UserTwoFactorAuthManager(BaseUserManager):
    def create(self, user: User, **kwargs):
        kwargs.setdefault('type', "SW")

        user_tfa = self.model(user=user, otp_token=random_base32(), **kwargs)
        user_tfa.full_clean()
        user_tfa.save()
        return user_tfa

    def generate_otp_token(self, user_tfa):
        user_tfa.otp_token = random_base32()
        user_tfa.full_clean()
        user_tfa.save()
        return user_tfa

    def generate_url_token(self, user_tfa):
        user_tfa.url_token = str(uuid4())
        user_tfa.full_clean()
        user_tfa.save()
        return user_tfa

    def delete_url_token(self, user_tfa):
        user_tfa.url_token = ""
        user_tfa.full_clean()
        user_tfa.save()
        return user_tfa



class UserTwoFactorAuth(models.Model):
    user = models.OneToOneField(
        to=User,
        on_delete=models.CASCADE,
        related_name="user_tfa",
        db_column="username",
        primary_key=True,
    )
    otp_token = models.CharField(
        db_column="otp_token",
        max_length=32,
        unique=True,
    )
    url_token = models.CharField(
        db_column="url_token",
        max_length=36,
        blank=True,
        default="",
        validators=[MinLengthValidator(36, message="too short token")]
    )
    type = models.CharField(
        db_column="type",
        max_length=2,
        choices=[("SW", "SOFTWARE"), ("EM", "EMAIL")],
    )

    objects = UserTwoFactorAuthManager()

    class Meta:
        db_table = "user_tfa"

    def __str__(self):
        return f"username: {self.user.username}, token: {self.otp_token}, type: {self.type}"
