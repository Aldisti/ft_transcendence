from rest_framework_simplejwt.tokens import RefreshToken

from django.db import models

from datetime import datetime
from pytz import timezone

from transcendence.settings import TIME_ZONE


TZ = timezone(TIME_ZONE)


class JwtTokenManager(models.Manager):
    def create(self, token: RefreshToken, **kwargs):
        expiry = datetime.fromtimestamp(token['exp'], tz=TZ)
        jwt_token = self.model(token=token['csrf'], exp=expiry)
        jwt_token.full_clean()
        jwt_token.save()
        return jwt_token


class JwtToken(models.Model):
    token = models.CharField(
        db_column="token",
        max_length=32,
        unique=True,
    )
    exp = models.DateTimeField(
        db_column="exp",
    )

    objects = JwtTokenManager()

    class Meta:
        db_table = "jwt_token"

    def __str__(self) -> str:
        return f"token: {self.token}, exp: {self.exp}"
