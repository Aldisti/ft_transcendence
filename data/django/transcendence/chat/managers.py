from django.db import models
import logging

logger = logging.getLogger(__name__)


class UserChatManager(models.Manager):
    def create(self, user, **kwargs):
        kwargs.setdefault("channel_name", "")
        user_chat = self.model(user=user, **kwargs)
        user_chat.full_clean()
        user_chat.save()
        return user_chat

    def update_channel_name(self, user_chat, channel_name: str):
        user_chat.channel_name = channel_name
        user_chat.full_clean()
        user_chat.save()
        return user_chat
