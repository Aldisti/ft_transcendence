from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from accounts.utils import Roles

class UserManager(BaseUserManager):
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
