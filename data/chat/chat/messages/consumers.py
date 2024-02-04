from django.conf import settings

from channels.generic.websocket import WebsocketConsumer

from asgiref.sync import async_to_sync

from users.models import ChatChannel

from messages.models import Message
from messages.builders import MessageBuilder

import logging

import json



logger = logging.getLogger(__name__)

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        user = self.scope["user"]
        logger.warning(f"{user.username} connected")
        # save chat_channel in database
        ChatChannel.objects.create(user, self.channel_name)
        # add websocket to global group (this can be a dedicated websocket)
        async_to_sync(self.channel_layer.group_add)(settings.G_GROUP, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        user = self.scope["user"]
        # remove websocket from global group
        async_to_sync(self.channel_layer.group_discard)(settings.G_GROUP, self.channel_name)
        # delete chat_channel from database
        chat_channel = ChatChannel.objects.get(channel_name=self.channel_name)
        chat_channel.delete()
        logger.warning(f"[{close_code}]: {user.username} disconnected")

    def chat_message(self, event):
        self.send(text_data=event["text"])

    def receive(self, text_data):
        user = self.scope["user"]
        logger.warning(f"Something arrived from {user.username}")
        data = json.loads(text_data)
        message_builder = (MessageBuilder().builder(user)
                           .set_msg_type(data.get("type", ""))
                           .set_msg_body(data.get("body", "")))
        Message.objects.message_controller(message_builder, data.get("receiver"))
