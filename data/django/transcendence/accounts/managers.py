
from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.core.files.storage import default_storage
from django.core.files.base import File
from django.conf import settings
from accounts.utils import Roles
import datetime
import logging


logger = logging.getLogger(__name__)


class UserManager(BaseUserManager):
    def create_user(self, username: str, email: str, **kwargs):
        if not email:
            raise ValueError("Missing email")
        email = self.normalize_email(email)
        if kwargs.get("role") != Roles.ADMIN:
            kwargs.pop("role", "")
        user = self.model(username=username, email=email, **kwargs)
        user.full_clean()
        user.save()
        return user

    def create_superuser(self, username: str, email: str, **kwargs):
        kwargs.setdefault("role", Roles.ADMIN)

        if not kwargs.get("role") == Roles.ADMIN:
            raise ValueError("admin must have admin role")
        user = self.create_user(username, email, **kwargs)
        return user

    def update_user_email(self, user, **kwargs):
        email = kwargs.get("email", user.email)
        if email == user.email:
            raise ValueError("invalid email")
        user.email = email
        user.full_clean()
        user.save()
        return user

    def update_user_role(self, user, role: str):
        if role != Roles.USER and role != Roles.MOD:
            raise ValueError("Not valid role")
        user.role = role
        user.full_clean()
        user.save()
        return user

    def is_already_registered(self, username="", email="") -> True:
        if self.get_queryset().filter(pk=username):
            return True
        if self.get_queryset().filter(email=email):
            return True
        return False


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
        user_info.full_clean()
        user_info.save()
        return user_info

    def update_picture(self, user_info, picture: File):
        if user_info.picture.__str__() != "":
            logger.warning(f"found path: {user_info.picture.path}")
            default_storage.delete(user_info.picture.path)
        user_info.picture = picture
        user_info.full_clean()
        user_info.save()
        return user_info


class UserWebsocketsManager(models.Manager):
    def create(self, user):
        user_websockets = self.model(user=user)
        user_websockets.full_clean()
        user_websockets.save()
        return user_websockets

    def update_chat_channel(self, user_websockets, chat_channel: str):
        user_websockets.chat_channel = chat_channel
        user_websockets.full_clean()
        user_websockets.save()
        return user_websockets

    def update_ntf_channel(self, user_websockets, ntf_channel: str):
        user_websockets.ntf_channel = ntf_channel
        user_websockets.full_clean()
        user_websockets.save()
        return user_websockets


class ChatChannelManager(models.Manager):
    def create(self, user_websockets, channel_name):
        chat_channel = self.model(user_websockets=user_websockets, channel_name=channel_name)
        chat_channel.full_clean()
        chat_channel.save()
        return chat_channel


class NtfChannelManager(models.Manager):
    def create(self, user_websockets, channel_name):
        ntf_channel = self.model(user_websockets=user_websockets, channel_name=channel_name)
        ntf_channel.full_clean()
        ntf_channel.save()
        return ntf_channel


class UserGameManager(models.Manager):
    def create(self, user, **kwargs):
        kwargs.setdefault('display_name', user.username)
        user_game = self.model(user=user, **kwargs)
        user_game.full_clean()
        user_game.save()
        return user_game

    def update_display_name(self, user_game, display_name: str):
        user_game.display_name = display_name
        user_game.full_clean()
        user_game.save()
        return user_game
