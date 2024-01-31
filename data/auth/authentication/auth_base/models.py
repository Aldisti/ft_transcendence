from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.core.validators import RegexValidator
from django.conf import settings
from django.db import models

from datetime import datetime


class Roles:
    ADMIN = 'A'
    MOD = 'M'
    USER = 'U'
    CHOICES = [
        (ADMIN, "Admin"),
        (MOD, "Moderator"),
        (USER, "User")
    ]


class UserManager(BaseUserManager):
    def create_user(self, username: str, password: str):
        user = self.model(username=username)
        user.set_password(password)
        user.full_clean()
        user.save()
        return user

    def update_username(self, user, username: str):
        user.username = username
        user.full_clean()
        user.save()
        return user

    def update_password(self, user, old_password: str, new_password: str):
        if old_password == "" or not user.check_password(old_password):
            raise ValueError("invalid old password")
        if new_password == "" or old_password == new_password:
            raise ValueError("invalid new password")
        user.set_password(new_password)
        user.full_clean()
        user.save()
        return user

    def reset_password(self, user, new_password: str):
        if new_password == "":
            raise ValueError("invalid new password")
        user.set_password(new_password)
        user.full_clean()
        user.save()
        return user

    def update_last_login(self, user):
        user.last_login = datetime.now(tz=settings.TZ)
        user.full_clean()
        user.save()
        return user

    def update_last_logout(self, user):
        user.last_logout = datetime.now(tz=settings.TZ)
        user.full_clean()
        user.save()
        return user

    def update_role(self, user, role: str):
        if user.role == Roles.ADMIN:
            raise ValueError("cannot change admin role")
        if role not in [Roles.USER, Roles.MOD]:
            raise ValueError("invalid role")
        if user.role == role:
            return
        user.role = role
        user.full_clean()
        user.save()
        return user

    def update_active(self, user, status: bool = None):
        if user.role == Roles.ADMIN:
            raise ValueError("cannot deactivate admin account")
        user.active = status
        user.full_clean()
        user.save()
        return user

    def update_verified(self, user, status: bool = None):
        if user.role == Roles.ADMIN:
            raise ValueError("cannot change admin verified")
        user.verified = status
        user.full_clean()
        user.save()
        return user

    def update_tfa(self, user, status: bool = None):
        user.tfa = status
        user.full_clean()
        user.save()
        return user


class User(AbstractBaseUser):
    username = models.CharField(
        db_column="username",
        max_length=32,
        unique=True,
        validators=[RegexValidator(regex="^[A-Za-z0-9!?*$~_-]{5,32}$")],
    )
    last_logout = models.DateTimeField(
        db_column="last_logout",
    )
    role = models.CharField(
        db_column="role",
        max_length=1,
        choices=Roles.CHOICES,
        default=Roles.USER,
    )
    active = models.BooleanField(
        db_column="active",
        default=True,
    )
    verified = models.BooleanField(
        db_column="verified",
        default=False,
    )
    tfa = models.BooleanField(
        db_column="tfa",
        db_comment="two factor authentication status",
        default=False,
    )

    USERNAME_FIELD = "username"

    objects = UserManager()

    class Meta:
        db_table = "user_auth"

    def __str__(self) -> str:
        return f"{self.username} ({self.last_login} - {self.last_logout})"
