from django.db import models
from accounts.models import User

# Create your models here.


class UserTokens(models.Model):
    user = models.OneToOneField(
        to=User,
        on_delete=models.CASCADE,
        related_name="user_tokens",
        db_column="username",
        primary_key=True,
    )
    email_token = models.CharField(
        db_column="email_token",
        max_length=36,
        blank=True,
        default="",
    )

    class Meta:
        db_table = "user_tokens"

    def __str__(self):
        return f"user: {self.user.username}, email_token: {self.email_token}"
