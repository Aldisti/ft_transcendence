from django.core.validators import EmailValidator
from django.db import models

from accounts.models import User


class UserIntraManager(models.Manager):
    def create(self, user: User, name: str, email: str):
        user_intra = self.model(user=user, name=name, email=email)
        user_intra.full_clean()
        user_intra.save()
        return user_intra


class UserIntra(models.Model):
    user = models.OneToOneField(
        to=User,
        on_delete=models.CASCADE,
        related_name="user_intra",
        db_column="user",
    )
    name = models.CharField(
        db_column="name",
        max_length=16,
        primary_key=True,
    )
    email = models.EmailField(
        db_column="email",
        max_length=320,
        unique=True,
        validators=[EmailValidator()],
    )

    objects = UserIntraManager()

    def is_linked(self):
        return self.name != "" and self.email != ""

    class Meta:
        db_table = "user_intra"

    def __str__(self):
        return f"username: {self.user.username}, name: {self.name}, email: {self.email}"
