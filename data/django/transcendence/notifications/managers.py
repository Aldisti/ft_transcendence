from django.db import models
from notifications.utils import NotificationTypes as NtfTypes

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
