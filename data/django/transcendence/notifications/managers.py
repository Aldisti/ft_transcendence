from django.db import models
from notifications.utils import NotificationTypes as NtfTypes
from notifications.utils import G_N_GROUP
from asgiref.sync import async_to_sync
from channels import layers
import json

import logging

logger = logging.getLogger(__name__)


class NotificationManager(models.Manager):
    def create(self, user_websockets, **kwargs):
        kwargs.setdefault("body", "")
        kwargs.setdefault("ntf_type", NtfTypes.INFO)
        if kwargs["body"] == "":
            raise ValueError("Notification body cannot be empty")
        notification = self.model(user=user_websockets, **kwargs)
        notification.full_clean()
        notification.save()
        return notification

    def send_notification(self, notification):
        user_websocket = notification.user
        ntf_channel = user_websocket.ntf_channel
        if ntf_channel != "":
            channel_layer = layers.get_channel_layer()
            json_data = [notification.to_json()]
            #logger.warning(f"data to send: {json_data}")
            #logger.warning(f"notification will be sent at {ntf_channel}")
            async_to_sync(channel_layer.send)(
                ntf_channel,
                {"type": "notification.message", "text": json.dumps(json_data)})
            #logger.warning(f"notification sent")
            notification.delete()

    # TODO: this function should be tested
    def send_group_notification(self, notification, group):
        channel_layer = layers.get_cannel_layer()
        json_data = [notification.to_json()]
        async_to_sync(channel_layer.group_send)({
            G_N_GROUP,
            {"type": "notification.message", "text": json.dumps(json_data)}
        })

    def send_friend_req(self, sender, receiver, token):
        ntf_body =f"token={token},sender={sender.username}"
        ntf_type = NtfTypes.FRIEND_REQ
        notification = self.create(receiver.user_websockets, body=ntf_body, ntf_type=ntf_type)
        self.send_notification(notification)

    def send_info_ntf(self, receiver, body):
        ntf_body = body
        ntf_type = NtfTypes.INFO
        notification = self.create(receiver.user_websockets, body=ntf_body, ntf_type=ntf_type)
        self.send_notification(notification)

    def send_allert_ntf(self, receiver, body):
        ntf_body = body
        ntf_type = NtfTypes.ALLERT
        notification = self.create(receiver.user_websockets, body=ntf_body, ntf_type=ntf_type)
        self.send_notification(notification)

    def send_ban_ntf(self, receiver, body):
        ntf_body = body
        ntf_type = NtfTypes.BAN
        notification = self.create(receiver.user_websockets, body=ntf_body, ntf_type=ntf_type)
        self.send_notification(notification)
