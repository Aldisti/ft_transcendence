from django.db import models
from django.core import validators

from users.models import UserWebsockets

from friends.managers import FriendsListManager


# Create your models here.

class FriendsList(models.Model):
    class Meta:
        db_table = "friends_list"
        constraints = [
            models.UniqueConstraint(
                fields=["user_1", "user_2"],
                name="friend_constraint",
            )
        ]


    user_1 = models.ForeignKey(
        UserWebsockets,
        on_delete=models.CASCADE,
        related_name="+",
        db_column="user_1",
    )

    user_2 = models.ForeignKey(
        UserWebsockets,
        on_delete=models.CASCADE,
        related_name="+",
        db_column="user_2",
    )

    sender = models.CharField(
        db_column="sender",
        max_length=32,
        blank=True,
    )

    token = models.CharField(
        db_column="token",
        max_length=36,
        blank=True,
        validators=[validators.MinLengthValidator(36, message="Too short token")]
    )

    creation_time = models.DateTimeField(
        db_column="creation_time",
        auto_now_add=True,
    )

    objects = FriendsListManager()

    def __str__(self):
        if self.token == "":
            return f"{self.user_1.username} and {self.user_2.username} are friends"
        return f"{self.user_1.username} and {self.user_2.username} will become friends someday"
