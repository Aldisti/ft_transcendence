from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.core.validators import RegexValidator, EmailValidator
from django.conf import settings
from django.db import models
from django.utils.timezone import now

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
    def create_user(self, username: str, email: str, password: str, **kwargs):
        kwargs.setdefault('role', Roles.USER)

        if password is None or password == '':
            raise ValueError('password cannot be empty')
        if kwargs['role'] != Roles.ADMIN:
            kwargs.pop('active', '')
            kwargs.pop('verified', '')
            kwargs.pop('tfa', '')
            kwargs.pop('role', '')
        user = self.model(username=username, email=email, **kwargs)
        user.set_password(password)
        user.full_clean()
        user.save()
        return user

    def create_superuser(self, username: str, email: str, password: str, **kwargs):
        kwargs.setdefault('role', Roles.ADMIN)
        kwargs.setdefault('active', True)
        kwargs.setdefault('verified', True)

        if not kwargs['active']:
            raise ValueError('active must be true')
        if not kwargs['verified']:
            raise ValueError('verified must be true')
        if kwargs['role'] != Roles.ADMIN:
            raise ValueError('role must be admin')
        return self.create_user(username, email, password, **kwargs)


    def update_username(self, user, **kwargs):
        try:
            username = kwargs['username']
            password = kwargs['password']
        except KeyError:
            raise ValueError('invalid username or password')
        if not user.check_password(password):
            raise ValueError('invalid password')
        if username == user.username:
            raise ValueError('invalid username')
        user.username = username
        user.full_clean()
        user.save()
        return user

    def update_email(self, user, **kwargs):
        try:
            email = kwargs['email']
            password = kwargs['password']
        except KeyError:
            raise ValueError('invalid email or password')
        if not user.check_password(password):
            raise ValueError('invalid password')
        if email == user.email:
            raise ValueError('invalid email')
        user.email = email
        user.full_clean()
        user.save()
        return user

    def update_password(self, user, **kwargs):
        try:
            old_password = kwargs['password']
            new_password = kwargs['new_password']
        except KeyError:
            raise ValueError('invalid password or new_password')
        if old_password == "" or not user.check_password(old_password):
            raise ValueError("invalid old password")
        if new_password == "" or old_password == new_password:
            raise ValueError("invalid new password")
        user.set_password(new_password)
        user.full_clean()
        user.save()
        return user

    def reset_password(self, user, **kwargs):
        new_password = kwargs.get('password', '')
        if new_password == "":
            raise ValueError("invalid new password")
        if user.check_password(new_password):
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
            return user
        user.role = role
        user.full_clean()
        user.save()
        return user

    def update_active(self, user, status: bool = None):
        if user.role == Roles.ADMIN:
            raise ValueError("cannot change admin active status")
        user.active = status
        user.full_clean()
        user.save()
        return user

    def update_verified(self, user, status: bool = None):
        if user.role == Roles.ADMIN:
            raise ValueError("cannot change admin verified status")
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
    email = models.EmailField(
        db_column="email",
        max_length=320,
        unique=True,
        validators=[EmailValidator()],
    )
    last_logout = models.DateTimeField(
        db_column="last_logout",
        default=now,
        null=True,
        blank=True,
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
