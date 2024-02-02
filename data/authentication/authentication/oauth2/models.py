from django.db import models
from django.core.validators import EmailValidator

from users.models import User


class OAuthUserManager(models.Manager):
    def create(self, user: User, email: str):
        oauth_user = self.model(user=user, email=email)
        oauth_user.full_clean()
        oauth_user.save()
        return oauth_user


class OAuthUser(models.Model):
    email = models.EmailField(
        db_column='email',
        primary_key=True,
        validators=[EmailValidator()],
    )

    objects = OAuthUserManager()

    class Meta:
        abstract = True

    def __str__(self) -> str:
        return f"email: {self.email}"


class IntraUser(OAuthUser):
    user = models.OneToOneField(
        to=User,
        on_delete=models.CASCADE,
        related_name='user_intra',
    )

    class Meta:
        db_table = 'user_intra'


class GoogleUser(OAuthUser):
    user = models.OneToOneField(
        to=User,
        on_delete=models.CASCADE,
        related_name='user_google',
    )

    class Meta:
        db_table = 'user_google'
