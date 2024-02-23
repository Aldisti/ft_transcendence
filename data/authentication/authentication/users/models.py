from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.core.exceptions import ObjectDoesNotExist
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

        if username == '' or email == '' or password == '':
            raise ValueError('missing username or email or password')
        if kwargs['role'] != Roles.ADMIN:
            kwargs.pop('active', '')
            kwargs.pop('verified', '')
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
        return self.create_user(
            username=username,
            email=email,
            password=password,
            **kwargs,
        )


    def update_username(self, user, **kwargs):
        username = kwargs.get('username', '')
        password = kwargs.get('password', '')
        if (username == '' or password == ''
                or not user.check_password(password)
                or username == user.username):
            raise ValueError('invalid username or password')
        user.username = username
        user.full_clean()
        user.save()
        return user

    def update_email(self, user, **kwargs):
        email = kwargs.get('email', '')
        password = kwargs.get('password', '')
        if email == '' or password == '':
            raise ValueError('missing email or password')
        if not user.check_password(password):
            raise ValueError('invalid password')
        if email == user.email:
            raise ValueError('invalid email')
        user.email = email
        user.full_clean()
        user.save()
        return user

    def update_password(self, user, **kwargs):
        old_password = kwargs.get('password', '')
        new_password = kwargs.get('new_password', '')
        if (old_password == '' or new_password == ''
                or not user.check_password(old_password)
                or old_password == new_password):
            raise ValueError("invalid old password or new password")
        user.set_password(new_password)
        user.full_clean()
        user.save()
        return user

    def reset_password(self, user, new_password: str):
        if new_password == "" or user.check_password(new_password):
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
        # TODO: is this ok? check the view params and you'll see
        status = not status
        if user.role == Roles.ADMIN:
            raise ValueError("cannot change admin active status")
        if user.active is status:
            return user
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

    USERNAME_FIELD = "username"

    objects = UserManager()

    class Meta:
        db_table = "user_auth"

    def is_moderator(self) -> bool:
        return self.role == Roles.MOD

    def is_admin(self) -> bool:
        return self.role == Roles.ADMIN

    def has_intra(self) -> bool:
        try:
            return self.user_intra.email != ''
        except ObjectDoesNotExist:
            return False

    def has_google(self) -> bool:
        try:
            return self.user_google.email != ''
        except ObjectDoesNotExist:
            return False

    def has_tfa(self) -> bool:
        return hasattr(self, 'user_tfa') and self.user_tfa.active

    def has_password_token(self) -> bool:
        return hasattr(self, 'password_token')

    def has_email_token(self) -> bool:
        return hasattr(self, 'email_token')

    def __str__(self) -> str:
        return f"{self.username} ({self.last_login} - {self.last_logout})"
