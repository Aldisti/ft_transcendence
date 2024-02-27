from channels.generic.websocket import WebsocketConsumer

from django.conf import settings

from asgiref.sync import async_to_sync

from users.models import NtfChannel

from notifications.models import Notification

import json

import logging

logger = logging.getLogger(__name__)


class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        user_websockets = self.scope["user"]
        # logger.warning(f"{user_websockets.username} connected to ntf sock")
        # update channel name when client connects
        NtfChannel.objects.create(user_websockets=user_websockets, channel_name=self.channel_name)
        # add client to global group
        async_to_sync(self.channel_layer.group_add)(settings.G_N_GROUP, self.channel_name)
        self.accept()
        # send all notifications stored in the database
        notifications = Notification.objects.filter(user_id=user_websockets.username).order_by("sent_time")
        if notifications:
            json_data = [ntf.to_json() for ntf in notifications]
            self.send(text_data=json.dumps(json_data))
            notifications.delete()


    def disconnect(self, close_code):
        user_websockets = self.scope["user"]
        # remove client to global group
        async_to_sync(self.channel_layer.group_discard)(settings.G_N_GROUP, self.channel_name)
        # update channel name when client disconnects
        ntf_channel = NtfChannel.objects.get(channel_name=self.channel_name)
        ntf_channel.delete()
        # logger.warning(f"[{close_code}]: {user_websockets.username} disconnected from ntf sock")

    def notification_message(self, event):
        # logger.warning(f"NOTIFICATION: {event['text']}")
        self.send(text_data=event["text"])
