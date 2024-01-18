from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from accounts.models import User, UserWebsockets
from chat.models import Message, Chat
from chat.utils import G_GROUP, MessageTypes
from chat.builders import MessageBuilder
from friends.models import FriendsList
import logging
import json
from datetime import datetime
from django.conf import settings

logger = logging.getLogger(__name__)

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        user = self.scope["user"]
        logger.warning(f"{user.username} connected")
        # update chat_channel in database
        try:
            UserWebsockets.objects.update_chat_channel(user.user_websockets, self.channel_name)
        except UserWebsockets.DoesNotExist:
            UserWebsockets.objects.create(user, chat_channel=self.channel_name)
        # add websocket to global group (this can be a dedicated websocket)
        async_to_sync(self.channel_layer.group_add)(G_GROUP, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        user = self.scope["user"]
        # remove websocket from global group
        async_to_sync(self.channel_layer.group_discard)(G_GROUP, self.channel_name)
        # update chat_channel in database
        user_websockets = UserWebsockets.objects.get(user=user)
        UserWebsockets.objects.update_chat_channel(user_websockets, chat_channel="")
        logger.warning(f"[{close_code}]: {user.username} disconnected")

    def chat_message(self, event):
        self.send(text_data=event["text"])

    def receive(self, text_data):
        user = self.scope["user"]
        data = json.loads(text_data)
        message_builder = (MessageBuilder().builder(user.user_websockets)
                           .set_msg_type(data.get("type", ""))
                           .set_msg_body(data.get("body", "")))
        Message.objects.message_controller(message_builder, data.get("receiver"))
