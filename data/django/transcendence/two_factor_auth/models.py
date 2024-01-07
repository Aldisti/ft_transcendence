from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ValidationError
from django.db import models

from accounts.models import User

from pyotp import random_base32
from uuid import uuid4


class UserTwoFactorAuthManager(BaseUserManager):
    def create(self, user: User, **kwargs):
        kwargs.setdefault('otp_token', "")
        kwargs.setdefault('url_token', "")
        kwargs.setdefault('type', "")

        user_tfa = self.model(user=user, **kwargs)
        user_tfa.full_clean()
        user_tfa.save()
        return user_tfa

    def activating(self, user_tfa, **kwargs):
        kwargs.setdefault('type', UserTFA.A_SOFTWARE)

        if user_tfa.type in UserTFA.TYPES.values():
            raise ValidationError("2fa already active")
        elif user_tfa.type in UserTFA.TYPES.keys():
            raise ValidationError("2fa activation process already started")
        user_tfa.type = kwargs['type']
        user_tfa.otp_token = random_base32()
        user_tfa.full_clean()
        user_tfa.save()
        return user_tfa

    def activate(self, user_tfa):
        user_tfa.type = UserTFA.TYPES[user_tfa.type]
        user_tfa.full_clean()
        user_tfa.save()
        return user_tfa

    def deactivate(self, user_tfa):
        if user_tfa.type == UserTFA.NONE:
            raise ValidationError("2fa not active")
        user_tfa.type = UserTFA.NONE
        user_tfa.otp_token = ""
        user_tfa.url_token = ""
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


class UserTFA(models.Model):
    SOFTWARE = "SW"
    EMAIL = "EM"
    A_SOFTWARE = "sw"
    A_EMAIL = "em"
    NONE = ""
    TFA_CHOICES = {
        SOFTWARE: "Software Token",
        EMAIL: "Email Token",
        A_SOFTWARE: "Activating Software Token",
        A_EMAIL: "Activating Email Token",
        NONE: "None ",
    }
    TYPES = {
        A_SOFTWARE: SOFTWARE,
        A_EMAIL: EMAIL,
    }

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
        blank=True,
        default="",
    )
    url_token = models.CharField(
        db_column="url_token",
        max_length=36,
        blank=True,
        default="",
    )
    type = models.CharField(
        db_column="type",
        max_length=2,
        blank=True,
        default=NONE,
        choices=TFA_CHOICES,
    )

    objects = UserTwoFactorAuthManager()

    class Meta:
        db_table = "user_tfa"

    def __str__(self):
        return f"username: {self.user.username}, token: {self.otp_token}, type: {self.type}"
