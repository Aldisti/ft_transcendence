from django.db import models
from django.core import validators

from users.managers import UserWebsocketsManager, ChatChannelManager, WebsocketTicketManager


# Create your models here.

class UserWebsockets(models.Model):
    class Meta:
        db_table = "user_websockets"


    username = models.CharField(
        primary_key=True,
        db_column="username",
        max_length=32,
        validators=[validators.RegexValidator(regex="^[A-Za-z0-9!?*$~_-]{5,32}$")],
    )

    objects = UserWebsocketsManager()

    def get_status(self):
        if self.chat_channels.all():
            return True
        return False

    def __str__(self):
        return f"username: {self.username}"


class WebsocketTicket(models.Model):
    class Meta:
        db_table = "websocket_ticket"


    user_websockets = models.ForeignKey(
        UserWebsockets,
        db_column="user_websockets",
        on_delete=models.CASCADE,
        related_name="+",
    )

    ticket = models.CharField(
        max_length=16,
        db_column="ticket",
        unique=True,
    )

    creation_time = models.DateTimeField(
        db_column="creation_time",
        auto_now_add=True,
    )

    objects = WebsocketTicketManager()

    def __str__(self):
        return f"{self.user_websockets_id} has ticket: {self.ticket}"


class ChatChannel(models.Model):
    class Meta:
        db_table="chat_channel"

    channel_name = models.CharField(
        primary_key=True,
        db_column="channel_name",
        max_length=255,
    )

    user_websockets = models.ForeignKey(
        UserWebsockets,
        on_delete=models.CASCADE,
        db_column="user_websockets",
        related_name="chat_channels",
    )

    objects = ChatChannelManager()

    def __str__(self):
        return f"user: {self.user_websockets_id}, chat_channel: {self.channel_name}"
