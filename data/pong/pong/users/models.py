from django.db import models
from django.core import validators

from users.managers import PongUserManager


# Create your models here.

class PongUser(models.Model):
    class Meta:
        db_table = "pong_user"


    username = models.CharField(
        primary_key=True,
        max_length=32,
        validators=[validators.RegexValidator(regex="^[A-Za-z0-9!?*$~_-]{5,32}$")],
        db_column="username",
    )

    ticket = models.CharField(
        max_length=16,
        db_column="ticket",
        blank=True,
    )

    objects = PongUserManager()

    def __str__(self):
        return f"user: {self.username}"
