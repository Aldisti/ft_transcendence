from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from accounts.utils import Roles
from django.core.files.storage import default_storage
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class UserManager(BaseUserManager):
    def create_user(self, username, email, password, **kwargs):
        if not email:
            raise ValueError("Missing email")
        email = self.normalize_email(email)
        if kwargs.get("role") != Roles.ADMIN:
            kwargs.pop("role", "")
            kwargs["verified"] = False
        user = self.model(username=username, email=email, **kwargs)
        user.set_password(password)
        user.full_clean()
        user.save()
        return user

    def create_superuser(self, username, email, password, **kwargs):
        kwargs.setdefault("active", True)
        kwargs.setdefault("verified", True)
        kwargs.setdefault("role", Roles.ADMIN)

        if not kwargs.get("active"):
            raise ValueError("active must be true")
        if not kwargs.get("verified"):
            raise ValueError("verified must be true")
        if not kwargs.get("role") == Roles.ADMIN:
            raise ValueError("admin must have admin role")
        return self.create_user(username, email, password, **kwargs)

    def update_user_email(self, user, **kwargs):
        email = kwargs.get("email", user.email)
        password = kwargs.get("password", "")
        if not user.check_password(password):
            raise ValueError("invalid password")
        if email == user.email:
            raise ValueError("invalid email")
        user.email = email
        user.full_clean()
        user.save()
        return user

    def update_user_password(self, user, **kwargs):
        password = kwargs.get("password", "")
        new_password = kwargs.get("new_password", password)
        if not user.check_password(password):
            raise ValueError("invalid password")
        if new_password == password:
            raise ValueError("invalid new password")
        user.set_password(new_password)
        user.full_clean()
        user.save()
        return user

    def reset_user_password(self, user, password):
        if password == "":
            raise ValueError("invalid new password")
        user.set_password(password)
        user.full_clean()
        user.save()
        return user

    def update_user_role(self, user, role):
        if role != Roles.USER and role != Roles.MOD:
            raise ValueError("Not valid role")
        user.role = role
        user.full_clean()
        user.save()
        return user

    def update_user_active(self, user, banned):
        if user.role != Roles.USER:
            raise ValueError("Cannot ban/unban mod or admin")
        user.active = not banned
        user.full_clean()
        user.save()
        return user

    def update_user_verified(self, user, verified):
        if user.role == Roles.ADMIN:
            raise ValueError("Cannot change admin's verification")
        user.verified = verified
        user.full_clean()
        user.save()
        return user


class UserInfoManager(models.Manager):
    def create(self, user, **kwargs):
        kwargs.setdefault("first_name", "")
        kwargs.setdefault("last_name", "")
        kwargs.setdefault("birthdate", None)
        kwargs.setdefault("picture", None)
        user_info = self.model(user=user, **kwargs)
        user_info.full_clean()
        user_info.save()
        return user_info

    def update_info(self, user_info, **kwargs):
        user_info.first_name = kwargs.get("first_name", user_info.first_name)
        user_info.last_name = kwargs.get("last_name", user_info.last_name)
        user_info.birthdate = kwargs.get("birthdate", user_info.birthdate)
        user_info.picture = kwargs.get("picture", user_info.picture)
        user_info.full_clean()
        user_info.save()
        return user_info

    def update_picture(self, user_info, picture):
        if user_info.picture.name != "":
            logger.warning(f"found path: {user_info.picture.path}")
            default_storage.delete(user_info.picture.path)
        user_info.picture = picture
        user_info.full_clean()
        user_info.save()
        return user_info