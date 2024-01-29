from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from accounts.models import NtfChannel
from notifications.models import Notification
from notifications.utils import G_N_GROUP
import json
import logging

logger = logging.getLogger(__name__)


class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        user = self.scope["user"]
        logger.warning(f"{user.username} connected to ntf sock")
        # update channel name when client connects
        NtfChannel.objects.create(user_websockets=user.user_websockets, channel_name=self.channel_name)
        # add client to global group
        async_to_sync(self.channel_layer.group_add)(G_N_GROUP, self.channel_name)
        self.accept()
        # send all notifications stored in the database
        notifications = Notification.objects.filter(user_id=user.username).order_by("sent_time")
        if notifications:
            json_data = [ntf.to_json() for ntf in notifications]
            self.send(text_data=json.dumps(json_data))
            notifications.delete()


    def disconnect(self, close_code):
        user = self.scope["user"]
        # remove client to global group
        async_to_sync(self.channel_layer.group_discard)(G_N_GROUP, self.channel_name)
        # update channel name when client disconnects
        ntf_channel = NtfChannel.objects.get(channel_name=self.channel_name)
        ntf_channel.delete()
        logger.warning(f"[{close_code}]: {user.username} disconnected from ntf sock")

    def notification_message(self, event):
        self.send(text_data=event["text"])
