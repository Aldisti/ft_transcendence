
from channels.generic.websocket import WebsocketConsumer

from asgiref.sync import async_to_sync

from users.views import generate_ticket

from logging import getLogger
from secrets import token_urlsafe

import json


GENERATE_TOKEN_URL = 'http://localhost:8001/generate-token'

logger = getLogger(__name__)


class QueueConsumer(WebsocketConsumer):
    users_queue = []

    def connect(self):
        user = self.scope["user"]
        self.group_name = f"{user.username}_group"
        if user.username in QueueConsumer.users_queue:
            logger.warning(f"{user.username} already connected")
            self.close(code=42)
            return

        self.accept()
        if len(QueueConsumer.users_queue) == 0:
            QueueConsumer.users_queue.append(user.username)
            async_to_sync(self.channel_layer.group_add)(
                    self.group_name, self.channel_name
            )
            return

        other_user = QueueConsumer.users_queue.pop(0)
        self.group_name = f"{other_user}_group"

        async_to_sync(self.channel_layer.group_add)(
            self.group_name, self.channel_name
        )

        message = {
            "user1": user.username,
            "user2": other_user,
            "ticket": token_urlsafe(12),
        }

        async_to_sync(self.channel_layer.group_send)(
            self.group_name, {"type": "queue.message", "message": message}
        )

    def disconnect(self, close_code):
        if close_code == 42:
            return

        user = self.scope["user"]

        if user.username in self.users_queue:
            self.users_queue.remove(user.username)

        async_to_sync(self.channel_layer.group_discard)(
                self.group_name, self.channel_name
        )

    def receive(self, text_data):
        pass

    def queue_message(self, event):
        self.send(text_data=json.dumps(event['message']))
        self.close()


class MatchConsumer(WebsocketConsumer):
    users = {}

    def connect(self):
        self.pong_user = self.scope["user"]
        self.match_token = self.scope["match_token"]

        if self.match_token is None:
            logger.warning(f"{self.pong_user.username} has an invalid token, connection refused")
            self.close(code=42)
            return

        if self.pong_user.username in MatchConsumer.users.values():
            logger.warning(f"{self.pong_user.username} already connected")
            self.close(code=42)
            return

        self.accept()

        async_to_sync(self.channel_layer.group_add)(
            f"{self.match_token}_group", self.channel_name
        )

        other_user = MatchConsumer.users.setdefault(self.match_token, self.pong_user.username)

        if other_user == self.pong_user.username:
            return
        
        message = {
            "user1": self.pong_user.username,
            "user2": other_user,
            "ticket": token_urlsafe(12),
        }

        async_to_sync(self.channel_layer.group_send)(
            f"{self.match_token}_group", {"type": "queue.message", "message": message}
        )

    def disconnect(self, close_code):
        if close_code == 42:
            return

        if MatchConsumer.users.get(self.match_token, "") != "":
            del MatchConsumer.users[self.match_token]

        async_to_sync(self.channel_layer.group_discard)(
            f"{self.match_token}_group", self.channel_name
        )

    def receive(self, text_data):
        pass

    def queue_message(self, event):
        self.send(text_data=json.dumps(event['message']))
        PongUser.objects.delete_match_token(self.pong_user)
        self.close(code=1000)

