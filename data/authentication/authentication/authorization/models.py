
from django.utils.timezone import now
from django.conf import settings
from django.db import models

from users.models import User

from datetime import datetime


class TokenManager(models.Manager):
    def create(self, token: str, **kwargs):
        kwargs.setdefault('iat', datetime.now(tz=settings.TZ))
        kwargs.setdefault('exp', datetime.now(tz=settings.TZ))
        if token is None or token == '':
            raise ValueError('no token provided')
        if kwargs['exp'] < kwargs['iat']:
            raise ValueError('invalid iat or exp')
        token = self.model(token=token, **kwargs)
        token.full_clean()
        token.save()
        return token

    def delete_expired(self):
        tokens = self.filter(exp__lt=datetime.now(tz=settings.TZ))
        size = len(tokens)
        for token in tokens:
            token.delete()
        return size


class Token(models.Model):
    token = models.CharField(
        db_column='token',
        max_length=32,
        primary_key=True,
    )
    iat = models.DateTimeField(
        db_column='iat',
        default=now,
    )
    exp = models.DateTimeField(
        db_column='exp',
        default=now,
    )

    objects = TokenManager()

    class Meta:
        db_table = 'token'

    def __str__(self) -> str:
        return f"token: {self.token} iat: {self.iat} exp: {self.exp}"
