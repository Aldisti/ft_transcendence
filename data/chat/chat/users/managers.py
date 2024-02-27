from django.db import models

from secrets import token_urlsafe


class UserWebsocketsManager(models.Manager):
    def create(self, username):
        user_websockets = self.model(username=username)
        user_websockets.full_clean()
        user_websockets.save()
        return user_websockets


class WebsocketTicketManager(models.Manager):
    def create(self, user_websockets, **kwargs):
        token = kwargs.get("ticket", "")
        if token == "":
            token = token_urlsafe(12)
        ticket = self.model(user_websockets=user_websockets, ticket=token)
        ticket.full_clean()
        ticket.save()
        return ticket


class ChatChannelManager(models.Manager):
    def create(self, user_websockets, channel_name):
        chat_channel = self.model(user_websockets=user_websockets, channel_name=channel_name)
        chat_channel.full_clean()
        chat_channel.save()
        return chat_channel
