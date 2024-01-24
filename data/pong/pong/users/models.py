from django.db import models

# Create your models here.

class User(models.Model):
    class Meta:
        db_table = "pong_user"


    username = models.CharField(
        max_length=32,
        # TODO: mettere controlli regex
        db_column="username",
        primary_key=True
    )
