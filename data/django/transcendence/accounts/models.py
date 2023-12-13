from django.db import models
from django.core import validators
from django.contrib.auth.base_user import AbstractBaseUser
from accounts.utils import Roles
from accounts.validators import validate_birthdate
from accounts.managers import UserManager, UserInfoManager

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

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"

    objects = UserManager()


    class Meta:
        db_table = "user"


    def __str__(self):
        return f"username: {self.username}, email: {self.email}, role: {self.role}"

class UserInfo(models.Model):
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
        blank=True,
        validators=[validate_birthdate],
    )
    date_joined = models.DateTimeField(
        db_column="date_joined",
        auto_now_add=True,
    )
    picture = models.FilePathField(
        db_column="picture",
        max_length=100,
        path="/tmp/images",
        recursive=True,
        blank=True,
    )

    objects = UserInfoManager()


    class Meta:
        db_table = "user_info"


    def __str__(self):
        return f"user: {self.user.username}, first_name: {self.first_name}, last_name: {self.last_name}, joined:{self.date_joined}"
