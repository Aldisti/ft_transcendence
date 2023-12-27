from rest_framework_simplejwt.tokens import Token

from django.db import models

from transcendence.settings import TZ

from datetime import datetime


class JwtTokenManager(models.Manager):
    def create(self, token: Token, **kwargs):
        if token is None:
            raise ValueError("Token value cannot be None")
        expiry = datetime.fromtimestamp(token['exp'], tz=TZ)
        if expiry < datetime.now(tz=TZ):
            raise ValueError("Token's already expired")
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
