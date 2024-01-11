
from django.core.exceptions import ValidationError
from django.db.models import Manager
from django.db import models

from accounts.models import User

from pyotp import random_base32
from secrets import choice
from string import ascii_lowercase, digits
from uuid import uuid4
import logging


logger = logging.getLogger(__name__)


class UserTwoFactorAuthManager(Manager):
    def create(self, user: User, **kwargs):
        kwargs.setdefault('otp_token', "")
        kwargs.setdefault('url_token', "")
        kwargs.setdefault('type', "")

        user_tfa = self.model(user=user, **kwargs)
        user_tfa.full_clean()
        user_tfa.save()
        return user_tfa

    def activating(self, user_tfa, tfa_type: str):
        if tfa_type is None or tfa_type == "":
            raise ValidationError("invalid 2fa type")
        if user_tfa.is_active():
            raise ValidationError("2fa already active")
        user_tfa.type = tfa_type.lower()
        logger.warning(f"type in model: {user_tfa.type}")
        user_tfa.otp_token = random_base32()
        user_tfa.full_clean()
        user_tfa.save()
        return user_tfa

    def activate(self, user_tfa):
        user_tfa.type = user_tfa.type.upper()
        user_tfa.full_clean()
        user_tfa.save()
        return user_tfa

    def deactivate(self, user_tfa):
        if not user_tfa.is_active():
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


class OtpCodeManager(Manager):
    def create(self, user_tfa):
        otp_code = self.model(user_tfa=user_tfa)
        otp_code.generate_code()

        otp_code.full_clean()
        otp_code.save()
        return otp_code

    def generate_codes(self, user_tfa):
        self.delete_codes(user_tfa)
        return [self.create(user_tfa=user_tfa) for i in range(10)]

    def delete_codes(self, user_tfa):
        codes = self.filter(user_tfa=user_tfa)
        for code in codes:
            code.delete()


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

    def is_active(self) -> bool:
        return ((self.type == self.EMAIL or self.type == self.SOFTWARE)
                and self.otp_token != "")

    def is_inactive(self) -> bool:
        return self.type == self.NONE or self.otp_token == ""

    def is_activating(self) -> bool:
        return self.type == self.A_EMAIL or self.type == self.A_SOFTWARE

    def is_email(self) -> bool:
        return self.type == self.EMAIL or self.type == self.A_EMAIL

    def is_software(self) -> bool:
        return self.type == self.SOFTWARE or self.type == self.A_SOFTWARE

    class Meta:
        db_table = "user_tfa"

    def __str__(self):
        return f"username: {self.user.username}, token: {self.otp_token}, type: {self.type}"


class OtpCode(models.Model):
    user_tfa = models.ForeignKey(
        to=UserTFA,
        on_delete=models.CASCADE,
    )
    code = models.CharField(
        db_column='code',
        max_length=10,
    )

    objects = OtpCodeManager()

    def generate_code(self):
        self.code = "".join([choice(ascii_lowercase + digits) for _ in range(10)])

    class Meta:
        db_table = "otp_code"

    def __str__(self) -> str:
        return f"username: {self.user_tfa.user.username}, code: {self.code}"
