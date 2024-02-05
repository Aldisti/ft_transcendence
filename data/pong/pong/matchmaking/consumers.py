
from channels.generic.websocket import WebsocketConsumer

from asgiref.sync import async_to_sync

from users.views import generate_ticket

from logging import getLogger
import json


GENERATE_TOKEN_URL = 'http://localhost:8001/generate-token'

logger = getLogger(__name__)


class QueueConsumer(WebsocketConsumer):
    users_queue = []

    def connect(self):
        user = self.scope["user"]
        if user.username in QueueConsumer.users_queue:
            logger.warning(f"{user.username} already connected")
            self.close()
            return
        self.accept()
        if len(QueueConsumer.users_queue) == 0:
            QueueConsumer.users_queue.append(user.username)
            async_to_sync(self.channel_layer.group_add)(f"{user.username}_group", self.channel_name)
            return
        other_user = QueueConsumer.users_queue.pop(0)
        group_name = f"{other_user}_group"
        async_to_sync(self.channel_layer.group_add)(
            group_name, self.channel_name
        )
        ticket = generate_ticket(user.username, other_user)
        if ticket == "":
            logger.warning(f"ticket not generated for {user.username} and {other_user.username}")
            message = {"error": "ticket not generated"}
        else:
            message = {
                "user1": user.username,
                "user2": other_user,
                "ticket": ticket,
            }
        async_to_sync(self.channel_layer.group_send)(
            group_name, {"type": "queue.message", "message": message}
        )

    def disconnect(self, close_code):
        user = self.scope["user"]
        if user.username in self.users_queue:
            self.users_queue.remove(user.username)
        self.close()

    def receive(self, text_data):
        pass

    def queue_message(self, event):
        self.send(text_data=json.dumps(event['message']))

