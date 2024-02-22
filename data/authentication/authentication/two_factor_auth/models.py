
from django.db import models
from django.conf import settings

from users.models import User

from pyotp import random_base32, TOTP, totp
from secrets import token_urlsafe
from datetime import datetime

from logging import getLogger


logger = getLogger(__name__)


class TFATypes:
    SOFTWARE = 'SW'
    EMAIL = 'EM'
    NONE = ''
    CHOICES = {
        SOFTWARE: 'Software',
        EMAIL: 'Email',
        NONE: 'Off',
    }


class UserTFAManager(models.Manager):
    def create(self, user: User):
        user_tfa = self.model(user=user)
        user_tfa.full_clean()
        user_tfa.save()
        return user_tfa

    def activate(self, user_tfa, otp_type: str):
        user_tfa.otp_type = otp_type
        user_tfa.otp_token = random_base32()
        user_tfa.full_clean()
        user_tfa.save()
        return user_tfa

    def deactivate(self, user_tfa):
        user_tfa.otp_token = ""
        user_tfa.url_token = ""
        user_tfa.otp_type = TFATypes.NONE
        user_tfa.active = False
        user_tfa.full_clean()
        user_tfa.save()
        return user_tfa

    def generate_url_token(self, user_tfa):
        user_tfa.url_token = token_urlsafe(32)
        user_tfa.full_clean()
        user_tfa.save()
        return user_tfa

    def delete_url_token(self, user_tfa):
        user_tfa.url_token = ""
        user_tfa.full_clean()
        user_tfa.save()
        return user_tfa

    def update_active(self, user_tfa):
        user_tfa.active = True
        user_tfa.full_clean()
        user_tfa.save()
        return user_tfa


class OtpCodeManager(models.Manager):
    def create(self, user_tfa):
        otp_code = self.model(user_tfa=user_tfa)
        otp_code.generate_code()
        otp_code.full_clean()
        otp_code.save()
        return otp_code

    def generate_codes(self, user_tfa) -> list:
        self.delete_codes(user_tfa)
        return [self.create(user_tfa=user_tfa) for i in range(10)]

    def delete_codes(self, user_tfa):
        self.filter(user_tfa=user_tfa).delete()

    def validate_code(self, user_tfa, code: str) -> bool:
        try:
            otp_code = user_tfa.codes.get(code=code)
        except user_tfa.codes.DoesNotExist:
            return False
        otp_code.delete()
        return True


class UserTFA(models.Model):
    """
    Software TFA:
        - otp_token
        - url_token
        - type
        - active
    Email TFA:
        - otp_token
        - url_token
        - type
        - active
    """
    user = models.OneToOneField(
        to=User,
        on_delete=models.CASCADE,
        related_name='user_tfa',
        db_column='user',
        primary_key=True,
    )
    otp_token = models.CharField(
        db_column='otp_token',
        max_length=48,
        blank=True,
        default="",
    )
    url_token = models.CharField(
        db_column='url_token',
        max_length=48,
        blank=True,
        default="",
    )
    otp_type = models.CharField(
        db_column='type',
        choices=TFATypes.CHOICES,
        default=TFATypes.NONE,
        blank=True,
    )
    active = models.BooleanField(
        db_column='active',
        default=False,
    )

    objects = UserTFAManager()

    def is_software(self) -> bool:
        return self.otp_type == TFATypes.SOFTWARE

    def is_email(self) -> bool:
        return self.otp_type == TFATypes.EMAIL

    def is_activating(self) -> bool:
        return self.otp_token != "" and not self.active

    def verify_otp_code(self, code: str) -> bool:
        otp_time = datetime.now(tz=settings.TZ)
        if self.is_email():
            return (TOTP(self.otp_token, interval=settings.TFA['EMAIL_INTERVAL'])
                    .verify(
                code,
                for_time=otp_time,
                valid_window=settings.TFA['EMAIL_WINDOW']
            ))
        elif self.is_software():
            return TOTP(self.otp_token).verify(
                code,
                for_time=otp_time,
                valid_window=settings.TFA['SOFTWARE_WINDOW'],
            )
        return False

    def get_code(self) -> str:
        if self.is_email():
            return TOTP(self.otp_token, interval=settings.TFA['EMAIL_INTERVAL']).now()
        elif self.is_software():
            return TOTP(self.otp_token).now()
        return ''

    def to_data(self) -> dict:
        return {'is_active': self.active, 'type': self.otp_type}

    def get_uri(self) -> str:
        if self.otp_token == '' or self.is_email():
            return ''
        return totp.TOTP(self.otp_token).provisioning_uri(name=self.user.email, issuer_name='Transcendence')

    def __str__(self):
        return f"user: {self.user.username} type: {self.otp_type} active: {self.active}"


class OtpCode(models.Model):
    user_tfa = models.ForeignKey(
        to=UserTFA,
        on_delete=models.CASCADE,
        related_name="codes",
        db_column="user_tfa",
    )
    # TODO: add hash to code field
    code = models.CharField(
        db_column='code',
        max_length=90,
    )

    objects = OtpCodeManager()

    def generate_code(self):
        self.code = random_base32()[:10]

    class Meta:
        db_table = "otp_code"

    def __str__(self) -> str:
        return f"username: {self.user_tfa.user.username}, code: {self.code}"
