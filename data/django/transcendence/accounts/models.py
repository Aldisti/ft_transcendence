from django.db import models
from django.core import validators
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from accounts.utils import Roles
from accounts.validators import validate_birthdate

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password, **kwargs):
        if not email:
            raise ValueError("Missing email")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **kwargs)
        user.set_password(password)
        user.full_clean()
        user.save()
        return user

    def create_superuser(self, username, email, password, **kwargs):
        kwargs.setdefault("active", True)
        kwargs.setdefault("role", Roles.ADMIN)

        if not kwargs.get("active") == True:
            raise ValueError("active must be true")
        if not kwargs.get("role") == Roles.ADMIN:
            raise ValueError("admin must have admin role")
        return self.create_user(username, email, password, **kwargs)

    def add_user_info(self, username, **kwargs):
        kwargs.setdefault("first_name", "")
        kwargs.setdefault("last_name", "")
        kwargs.setdefault("birthdate", None)
        kwargs.setdefault("picture", None)
        user = User.objects.get(pk=username)
        user_info = UserInfo(user=user, **kwargs)
        user_info.full_clean()
        user_info.save()
        return user_info

    def update_user_info(self, username, **kwargs):
        user = User.objects.get(pk=username)
        user_info = user.user_info
        user_info.first_name = kwargs.get("first_name", user_info.first_name)
        user_info.last_name = kwargs.get("last_name", user_info.last_name)
        user_info.birthdate = kwargs.get("birthdate", user_info.birthdate)
        user_info.picture = kwargs.get("picture", user_info.picture)
        user_info.full_clean()
        user_info.save()
        return user_info

# Create your models here.

class User(AbstractBaseUser):
    ROLES_CHOICES = [
        (Roles.ADMIN, "admin"),
        (Roles.MOD, "mod"),
        (Roles.USER, "user"),
    ]
    username = models.CharField(
        db_column="username",
        max_length=32,
        primary_key=True,
        validators=[validators.RegexValidator(regex="^[A-Za-z0-9!?*@$~_-]{5,32}$")],
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
        choices=ROLES_CHOICES,
        default=Roles.USER,
    )
    active = models.BooleanField(
        db_column="active",
        db_comment="False when user is banned",
        default=True,
    )

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"

    objects = CustomUserManager()

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


    class Meta:
        db_table = "user_info"


    def __str__(self):
        return f"user: {self.user.username}, first_name: {self.first_name}, last_name: {self.last_name}, joined:{self.date_joined}"
