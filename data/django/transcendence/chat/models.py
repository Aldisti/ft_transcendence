from django.db import models
from django.core import validators
from chat.managers import UserChatManager
from accounts.models import User, UserWebsockets

import logging


logger = logging.getLogger(__name__)


# Create your models here.


class Chat(models.Model):
    class Meta:
        db_table = "chat"


    chat_name = models.CharField(
        db_column="chat_name",
        max_length=255,
        unique=True,
    )


class ChatMember(models.Model):
    class Meta:
        db_table = "chat_member"


    chat = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
        related_name="+",
        db_column="chat_id",
    )

    user = models.ForeignKey(
        UserWebsockets,
        on_delete=models.CASCADE,
        related_name="+",
        db_column="username"
    )


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
        max_length=512,
    )

    sent_time = models.DateTimeField(
        db_column="sent_time",
        auto_now_add=True,
    )

    def __str__(self):
        return f"from_user: {self.from_user.username}, body: {self.body}, sent_time: {self.sent_time}"
