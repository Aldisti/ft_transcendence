from django.db import models
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
