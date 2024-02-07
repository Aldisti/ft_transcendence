
from django.utils.timezone import now
from django.conf import settings
from django.db import models

from users.models import User

from datetime import datetime, timedelta
from secrets import token_urlsafe


class TokenManager(models.Manager):

    def delete_expired_now(self) -> None:
        """
        Delete all token with `exp` less or equal to now
        """
        self.filter(exp__lt=datetime.now(tz=settings.TZ)).delete()

    def delete_issued_after_seconds(self, stime: int) -> None:
        """
        Delete all tokens with `iat` older than `stime` seconds
        """
        exp_time = datetime.now(tz=settings.TZ) - timedelta(seconds=stime)
        self.filter(iat__lt=exp_time).delete()


class JwtBlackListManager(TokenManager):
    def create(self, token: str, exp: datetime):
        token = self.model(token=token, exp=exp)
        token.full_clean()
        token.save()
        return token


class UserTokenManager(TokenManager):
    def create(self, user: User):
        token = token_urlsafe(24)
        token = self.model(user=user, token=token)
        token.full_clean()
        token.save()
        return token


class Token(models.Model):
    token = models.CharField(
        db_column='token',
        max_length=32,
        primary_key=True,
    )
    iat = models.DateTimeField(
        db_column='iat',
        db_comment='the `issued at` datetime',
        default=now,
    )
    exp = models.DateTimeField(
        db_column='exp',
        db_comment='the `expire` datetime',
        default=now,
    )

    class Meta:
        abstract = True

    def to_data(self) -> dict:
        return {'token': self.token}

    def __str__(self) -> str:
        return f"token: {self.token} iat: {self.iat} exp: {self.exp}"


class JwtBlackList(Token):
    iat = None

    objects = JwtBlackListManager()

    class Meta:
        db_table = 'jwt_blacklist'

    def __str__(self) -> str:
        return f"token: {self.token} exp: {self.exp}"


class PasswordResetToken(Token):
    exp = None
    user = models.OneToOneField(
        to=User,
        on_delete=models.CASCADE,
        related_name='password_token',
        db_column='user',
    )

    class Meta:
        db_table = 'password_reset_token'

    def to_data(self) -> dict:
        return {
            'username': self.user.username,
            'email': self.user.email,
            'token': self.token,
        }

    def __str__(self) -> str:
        return f"user: {self.user.username} token: {self.token} iat: {self.iat}"


class EmailVerificationToken(Token):
    exp = None
    user = models.OneToOneField(
        to=User,
        on_delete=models.CASCADE,
        related_name='email_token',
        db_column='user',
    )

    class Meta:
        db_table = 'email_verification_token'

    def __str__(self) -> str:
        return f"user: {self.user.username} token: {self.token} iat: {self.iat}"
