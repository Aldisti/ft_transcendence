from django.db import models
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class ChatManager(models.Manager):
    def create(self, chat_name):
        chat = self.model(chat_name=chat_name)
        chat.full_clean()
        chat.save()
        return chat

class ChatMemberManager(models.Manager):
    def create(self, chat, user):
        chat_member = self.model(chat=chat, user=user)
        chat_member.full_clean()
        chat_member.save()
        return chat_member

class MessageManager(models.Manager):
    def create(self, chat, from_user, body):
        message = self.model(chat=chat, from_user=from_user, body=body)
        message.full_clean()
        message.save()
        self.limit_messages(chat)
        return message

    # limits messages per chat
    def limit_messages(self, chat):
        messages = self.get_queryset().filter(chat=chat).order_by("sent_time")
        if len(messages) > settings.MAX_MESSAGES:
            messages[0].delete()
