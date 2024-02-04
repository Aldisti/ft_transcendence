from django.db import models

from users.models import UserWebsockets

from notifications.managers import NotificationManager
from notifications.utils import NotificationTypes as NtfTypes


# Create your models here.

class Notification(models.Model):
    class Meta:
        db_table = "notification"

    user = models.ForeignKey(
        UserWebsockets,
        on_delete=models.CASCADE,
        related_name="+",
        db_column="username",
    )

    ntf_type = models.CharField(
        db_column="ntf_type",
        max_length=32,
        choices=NtfTypes.NOTIFICATION_CHOICES,
        default=NtfTypes.INFO
    )

    body = models.TextField(
        db_column="body",
        blank=False,
        null=False,
    )

    sent_time = models.DateTimeField(
        db_column="sent_time",
        auto_now_add=True,
    )

    objects=NotificationManager()

    def __str__(self):
        return f"username: {self.user.username}, notification: {self.body}, sent_time: {self.sent_time}"

    def to_json(self) -> dict:
        data = {
            "type": self.ntf_type,
            "body": self.body,
            "sent_time": self.sent_time.strftime("%Y/%m/%d:%H.%M.%S"),
        }
        return data
