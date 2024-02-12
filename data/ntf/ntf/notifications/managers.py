from django.db import models
from django.conf import settings

from asgiref.sync import async_to_sync

from channels import layers

from notifications.utils import NotificationTypes as NtfTypes

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
        #logger.warning(f"SENDING NOTIFICATION")
        user_websocket = notification.user
        ntf_channels = user_websocket.ntf_channels.all()
        channel_layer = layers.get_channel_layer()
        for ntf_channel in ntf_channels:
            json_data = [notification.to_json()]
            #logger.warning(f"data to send: {json_data}")
            #logger.warning(f"notification will be sent at {ntf_channel.channel_name}")
            async_to_sync(channel_layer.send)(
                ntf_channel.channel_name,
                {"type": "notification.message", "text": json.dumps(json_data)})
            #logger.warning(f"notification sent")
        if ntf_channels:
            notification.delete()

    # TODO: this function should be tested
    def send_group_notification(self, notification):
        channel_layer = layers.get_cannel_layer()
        json_data = [notification.to_json()]
        async_to_sync(channel_layer.group_send)({
            settings.G_N_GROUP,
            {"type": "notification.message", "text": json.dumps(json_data)}
        })

    def send_match_req(self, opponent, receiver, token):
        ntf_body =f"token={token},opponent={opponent.username}"
        ntf_type = NtfTypes.MATCH_REQ
        notification = self.create(receiver, body=ntf_body, ntf_type=ntf_type)
        self.send_notification(notification)

    def send_friend_req(self, sender, receiver, token):
        ntf_body =f"token={token},sender={sender.username}"
        ntf_type = NtfTypes.FRIEND_REQ
        notification = self.create(receiver, body=ntf_body, ntf_type=ntf_type)
        self.send_notification(notification)

    def send_info_ntf(self, receiver, body):
        #logger.warning("SENDING INFO NOTIFICATION")
        ntf_body = body
        ntf_type = NtfTypes.INFO
        notification = self.create(receiver, body=ntf_body, ntf_type=ntf_type)
        self.send_notification(notification)

    def send_alert_ntf(self, receiver, body):
        ntf_body = body
        ntf_type = NtfTypes.ALERT
        notification = self.create(receiver, body=ntf_body, ntf_type=ntf_type)
        self.send_notification(notification)

    def send_ban_ntf(self, receiver, body):
        ntf_body = body
        ntf_type = NtfTypes.BAN
        notification = self.create(receiver, body=ntf_body, ntf_type=ntf_type)
        self.send_notification(notification)
