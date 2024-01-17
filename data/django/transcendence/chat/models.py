from django.db import models
from django.core import validators
from django.conf import settings
from chat.managers import ChatManager, ChatMemberManager, MessageManager
from chat.utils import MessageTypes
from accounts.models import User, UserWebsockets

import logging


logger = logging.getLogger(__name__)


# Create your models here.

# TODO: The chat system can be improved implementing a status of the chat 
# that will be checked istead of deleting the entire chat

class Chat(models.Model):
    class Meta:
        db_table = "chat"


    chat_name = models.CharField(
        db_column="chat_name",
        max_length=255,
        unique=True,
    )

    objects = ChatManager()


class ChatMember(models.Model):
    class Meta:
        db_table = "chat_member"


    chat = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
        related_name="chat_member",
        db_column="chat_id",
    )

    user = models.ForeignKey(
        UserWebsockets,
        on_delete=models.CASCADE,
        related_name="+",
        db_column="username"
    )

    objects = ChatMemberManager()


class Message(models.Model):
    class Meta:
        db_table = "message"

    chat = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
        related_name="+",
        db_column="chat_id",
    )

    from_user = models.ForeignKey(
        UserWebsockets,
        on_delete=models.CASCADE,
        related_name="+",
        db_column="from_user",
    )

    body = models.CharField(
        db_column="body",
        max_length=settings.MAX_MESSAGE_LENGTH,
    )

    sent_time = models.DateTimeField(
        db_column="sent_time",
        auto_now_add=True,
    )

    objects = MessageManager()

    def to_json(self):
        json = {
            "type": MessageTypes.PRIVATE,
            "body": self.body,
            "sender": self.from_user.user_id,
            "sent_time": self.sent_time.strftime("%Y/%m/%d:%H.%M.%S"),
        }
        return json

    def __str__(self):
        return f"from_user: {self.from_user.user_id}, body: {self.body}, sent_time: {self.sent_time}"
