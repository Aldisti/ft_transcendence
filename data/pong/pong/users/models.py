from django.db import models
from django.core import validators

# Create your models here.

class PongUser(models.Model):
    class Meta:
        db_table = "pong_user"


    username = models.CharField(
        max_length=32,
        validators=[validators.RegexValidator(regex="^[A-Za-z0-9!?*$~_-]{5,32}$")],
        db_column="username",
        primary_key=True
    )
