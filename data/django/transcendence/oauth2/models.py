from django.core.validators import EmailValidator, MinLengthValidator
from django.db import models

from accounts.models import User


class UserIntraManager(models.Manager):
    def create(self, user: User, **kwargs):
        kwargs.setdefault('intra_name', '')
        kwargs.setdefault('intra_email', '')
        kwargs.setdefault('google_name', '')
        kwargs.setdefault('google_email', '')

        user_openid = self.model(user=user, **kwargs)
        user_openid.full_clean()
        user_openid.save()
        return user_openid

    def link_intra(self, user_openid, **kwargs):
        user_openid.intra_name = kwargs.get('intra_name', user_openid.intra_name)
        user_openid.intra_email = kwargs.get('intra_email', user_openid.intra_email)
        user_openid.full_clean()
        user_openid.save()
        return user_openid

    def unlink_intra(self, user_openid):
        return self.link_intra(user_openid, intra_name='', intra_email='')

    def link_google(self, user_openid, **kwargs):
        user_openid.google_name = kwargs.get('google_name', user_openid.google_name)
        user_openid.google_email = kwargs.get('google_email', user_openid.google_email)
        user_openid.full_clean()
        user_openid.save()
        return user_openid

    def unlink_google(self, user_openid):
        return self.link_google(user_openid, google_name='', google_email='')

    def unlink_all(self, user_openid):
        return self.unlink_google(self.unlink_intra(user_openid))


class UserOpenId(models.Model):
    user = models.OneToOneField(
        to=User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="user_openid",
        db_column="username",
    )
    intra_name = models.CharField(
        db_column="intra_name",
        db_comment="user's intra username",
        max_length=10,
        unique=True,
        blank=True,
        default='',
        validators=[MinLengthValidator(6)],
    )
    intra_email = models.EmailField(
        db_column="intra_email",
        db_comment="user's intra email",
        max_length=256,
        unique=True,
        blank=True,
        default='',
        validators=[EmailValidator()],
    )
    google_name = models.CharField(
        db_column="google_name",
        db_comment="user's google username",
        max_length=32,
        unique=True,
        blank=True,
        default='',
        validators=[MinLengthValidator(1)],
    )
    google_email = models.EmailField(
        db_column="google_email",
        db_comment="user's google email",
        max_length=256,
        unique=True,
        blank=True,
        default='',
        validators=[EmailValidator()],
    )

    objects = UserIntraManager()

    def is_intra_linked(self) -> bool:
        return self.intra_name != "" or self.intra_email != ""

    def is_google_linked(self) -> bool:
        return self.google_name != "" or self.google_email != ""

    class Meta:
        db_table = "user_openid"

    def __str__(self):
        return (f"username: {self.user.username}, "
                f"intra_name: {self.intra_name}, intra_email: {self.intra_email}, "
                f"google_name: {self.google_name}, google_email: {self.google_email}, ")
