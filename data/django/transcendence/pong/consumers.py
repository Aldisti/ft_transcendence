
from channels.generic.websocket import WebsocketConsumer

from asgiref.sync import async_to_sync

import logging
import json
from requests import get


logger = logging.getLogger(__name__)
GENERATE_TOKEN_URL = 'http://localhost:8001/generate-token'


def get_match_token(player1: str, player2: str) -> str:
    api_response = get(GENERATE_TOKEN_URL, params={'player1': player1, 'player2': player2})
    if api_response.status_code != 200:
        logger.error('API_ERROR:', api_response)
        return ""
    return api_response.json()['token']


class QueueConsumer(WebsocketConsumer):
    users_queue = []

    def connect(self):
        user = self.scope["user"]
        logger.warning(f"{user.username} connected")
        if user.username in self.users_queue:
            self.close()
            return
        self.accept()
        if len(self.users_queue) == 0:
            self.users_queue.append(user.username)
            async_to_sync(self.channel_layer.group_add)(f"{user.username}_group", self.channel_name)
            return
        else:
            other_user = self.users_queue.pop(0)
            group_name = f"{other_user}_group"
            message = f"{user.username} connected to {other_user}"
            token = get_match_token(player1=other_user, player2=user.username)
            data = {
                'type': 'queue.message',
                'message': message,
                # 'token': token,
            }
            async_to_sync(self.channel_layer.group_add)(group_name, self.channel_name)
            async_to_sync(self.channel_layer.group_send)(
                group_name, {"type": "queue.message", "message": message}
            )

    def disconnect(self, close_code):
        user = self.scope["user"]
        if user.username in self.users_queue:
            self.users_queue.remove(user.username)
        self.close()

    def receive(self, text_data=None):
        pass

    def queue_message(self, event):
        self.send(text_data=json.dumps(event['message']))

