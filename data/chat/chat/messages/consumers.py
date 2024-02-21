from django.conf import settings

from channels.generic.websocket import WebsocketConsumer

from asgiref.sync import async_to_sync

from users.models import ChatChannel

from messages.models import Message
from messages.builders import MessageBuilder

from friends.models import FriendsList
from friends.utils import get_users_from_friends

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

        # send status to all friends
        if user.get_channels().count() == 1:
            message = {"type": "connected", "body": user.username}
            self.send_status(user, message)

    def disconnect(self, close_code):
        user = self.scope["user"]

        # send status to all friends
        if user.get_channels().count() == 1:
            message = {"type": "disconnected", "body": user.username}
            self.send_status(user, message)

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

    def send_status(self, user, message):
        # send status to all friends
        friends_list = FriendsList.objects.get_all_friends(user)
        friends = get_users_from_friends(friends=friends_list, common_friend=user)

        for friend in friends:
            for channel in friend.get_channels():
                async_to_sync(self.channel_layer.group_send)(
                    channels.channel_name,
                    {"type": "chat.message", "text": json.dumps(message)}
                )
