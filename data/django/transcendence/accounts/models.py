from django.db import models
from django.core import validators
from django.core.files import File
from django.core.files.storage import default_storage
from django.contrib.auth.base_user import AbstractBaseUser
from django.dispatch import receiver

from accounts.utils import Roles
from accounts.validators import validate_birthdate
from accounts.managers import (UserManager,
                               UserInfoManager,
							   UserGameManager)

import logging

from requests import get as get_request

logger = logging.getLogger(__name__)


# Create your models here.

class User(AbstractBaseUser):
    username = models.CharField(
        db_column="username",
        max_length=32,
        primary_key=True,
        validators=[validators.RegexValidator(regex="^[A-Za-z0-9!?*$~_-]{5,32}$")],
    )
    email = models.EmailField(
        db_column="email",
        max_length=320,
        unique=True,
        validators=[validators.EmailValidator()],
    )
    role = models.CharField(
        db_column="role",
        max_length=1,
        choices=Roles.ROLES_CHOICES,
        default=Roles.USER,
    )
    active = models.BooleanField(
        db_column="active",
        db_comment="False when user is banned",
        default=True,
    )
    verified = models.BooleanField(
        db_column="verified",
        db_comment="True when email is verified",
        default=False,
    )
    linked = models.BooleanField(
        db_column="linked",
        db_comment="True when oauth2 is active",
        default=False,
    )
    last_logout = models.DateTimeField(
        db_column="last_logout",
        db_comment="the datetime of the last logout from all devices",
    )

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"

    objects = UserManager()

    class Meta:
        db_table = "user_auth"

    def get_picture(self):
        return self.user_info.picture

    def __str__(self):
        return f"username: {self.username}, email: {self.email}, role: {self.role}"


def upload_user_picture(instance, filename):
    return f"{instance.user.username}_{filename}"


class UserInfo(models.Model):
    class Meta:
        db_table = "user_info"

    user = models.OneToOneField(
        to=User,
        on_delete=models.CASCADE,
        related_name="user_info",
        primary_key=True,
    )
    first_name = models.CharField(
        db_column="first_name",
        max_length=32,
        blank=True,
        validators=[validators.RegexValidator(regex="^[A-Za-z -]{1,32}$")],
    )
    last_name = models.CharField(
        db_column="last_name",
        max_length=32,
        blank=True,
        validators=[validators.RegexValidator(regex="^[A-Za-z -]{1,32}$")],
    )
    birthdate = models.DateField(
        db_column="birthdate",
        null=True,
        blank=True,
        validators=[validate_birthdate],
    )
    date_joined = models.DateTimeField(
        db_column="date_joined",
        auto_now_add=True,
    )
    picture = models.FileField(
        db_column="picture",
        max_length=100,
        upload_to=upload_user_picture,
        default="",
        blank=True,
        null=True,
    )

    objects = UserInfoManager()

    @receiver(models.signals.pre_delete, sender=User)
    def image_delete(sender, **kwargs):
        """
        The on_delete=CASCADE doesn't call the delete function of the related model,
        but send the pre_delete and post_delete signals.
        This function catches the pre_delete signal in order to delete the profile image
        """
        instance = kwargs.get("instance", None)
        if instance is not None and instance.user_info.picture.__str__() != "":
            default_storage.delete(instance.user_info.picture.path)

    def __str__(self):
        return f"user: {self.user.username}, first_name: {self.first_name}, last_name: {self.last_name}, joined:{self.date_joined}"


class UserGame(models.Model):
    class Meta:
        db_table = "user_game"

    user = models.OneToOneField(
        to=User,
        on_delete=models.CASCADE,
        related_name="user_game",
        primary_key=True,
        db_column="username",
    )
    display_name = models.CharField(
        db_column="display_name",
        max_length=32,
        unique=True,
        validators=[validators.RegexValidator(regex="^[A-Za-z0-9!?*$~_-]{5,32}$")],
    )

    objects = UserGameManager()

    def __str__(self) -> str:
        return f"username: {self.user.username}, display_name: {self.display_name}"
