from django.db import models
from django.conf import settings

from channels import layers

from asgiref.sync import async_to_sync

from messages.utils import MessageTypes
from messages.serializers import MessageSerializer

from friends.models import FriendsList

from users.models import UserWebsockets, ChatChannel

import logging

import json


logger = logging.getLogger(__name__)


class ChatManager(models.Manager):
    def create(self, chat_name):
        chat = self.model(chat_name=chat_name)
        chat.full_clean()
        chat.save()
        return chat

    def get_chat(self, username_1: str, username_2: str):
        chat = self.get_queryset().filter(chat_member__user_id=username_1).filter(chat_member__user_id=username_2)
        if chat:
            return chat[0]
        return None

class ChatMemberManager(models.Manager):
    def create(self, chat, user):
        chat_member = self.model(chat=chat, user=user)
        chat_member.full_clean()
        chat_member.save()
        return chat_member

class MessageManager(models.Manager):
    def create_message(self, chat, from_user, body):
        message = self.model(chat=chat, from_user=from_user, body=body)
        return self.create(message)

    def create_message(self, chat, message):
        message.chat = chat
        return self.create(message)

    def create(self, message):
        message.full_clean()
        message.save()
        self.limit_messages(message.chat)
        return message

    # limits messages per chat
    def limit_messages(self, chat):
        messages = self.get_queryset().filter(chat=chat).order_by("sent_time")
        if len(messages) > settings.MAX_MESSAGES:
            messages[0].delete()

    def send_message(self, serialized_data, recv):
        channel_layer = layers.get_channel_layer()
        chat_channels = ChatChannel.objects.filter(user_websockets=recv)
        for chat_channel in chat_channels:
            async_to_sync(channel_layer.send)(
                chat_channel.channel_name,
                {"type": "chat.message", "text": serialized_data}
            )

    def send_message_group(self, serialized_data, group):
        channel_layer = layers.get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            group,
            {"type": "chat.message", "text": serialized_data}
        )

    def send_global_message(self, message):
        data = MessageSerializer().get_data(message)
        data.setdefault("type", MessageTypes.GLOBAL)
        self.send_message_group(json.dumps(data), settings.G_GROUP)

    # TODO: test
    def send_error_message(self, message):
        data = MessageSerializer().get_data(message)
        data.setdefault("type", MessageTypes.ERROR)
        self.send_message(json.dumps(data), message.from_user)

    def send_private_message(self, message, receiver: str):
        from messages.models import Chat

        rec_user = self.get_friend_from_username(receiver, message.from_user)
        if rec_user is None:
            message.body = "Invalid receiver"
            self.send_error_message(message)
            return
        # take chat
        chat = Chat.objects.get_chat(message.from_user.username, receiver)
        if chat is None:
            message.body = "Invalid chat, server error"
            self.send_error_message(message)
            return
        # store the message in the database
        message = self.create_message(chat, message)
        if rec_user.get_status():
            data = MessageSerializer().get_data(message)
            data.setdefault("type", MessageTypes.PRIVATE)
            self.send_message(json.dumps(data), rec_user)
    
    # TODO: test
    def message_controller(self, message_builder, receiver: str):
        message = message_builder.build()
        #logger.warning(f"MESSAGE: {message['message']}")
        #logger.warning(f"RECEIVER: {receiver}")
        #logger.warning(f"TYPE: {message['msg_type']}")
        if message["msg_type"] == MessageTypes.ERROR:
            self.send_error_message(message["message"])
        elif message["msg_type"] == MessageTypes.GLOBAL:
            self.send_global_message(message["message"])
        else:
            self.send_private_message(message["message"], receiver)


    def get_friend_from_username(self, username: str, user: UserWebsockets):
        try:
            friend = UserWebsockets.objects.get(pk=username)
        except UserWebsockets.DoesNotExist:
            return None
        if FriendsList.objects.are_friends(friend, user):
            return friend
        return None
