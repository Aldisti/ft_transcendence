from rest_framework_simplejwt.tokens import Token

from django.db import models

from transcendence.settings import TZ

from datetime import datetime


class JwtTokenManager(models.Manager):
    def create(self, token: Token, **kwargs):
        if token is None or 'csrf' not in token.payload:
            raise ValueError("Token cannot be None")
        expiry = datetime.fromtimestamp(token['exp'], tz=TZ)
        if expiry < datetime.now(tz=TZ):
            raise ValueError("Token's already expired")
        jwt_token = self.model(token=token['csrf'], exp=expiry)
        jwt_token.full_clean()
        jwt_token.save()
        return jwt_token


# Query to delete all records expired
# delete from <table> where <column> < now();
# If you want to add an interval, e.g. you want to delete all records
# before 2 days you can use 'interval'
# delete from <table> where <column> < now() + interval '2 days';
# In our case the query should be similar to the first case


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
