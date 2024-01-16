from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from accounts.models import User, UserWebsockets
import logging
import json

logger = logging.getLogger(__name__)

# name of global group
G_GROUP = "global_group"

# class used in order to define accepted type of messages
class ValidTypes:
    GLOBAL = "global"
    PRIVATE = "private"
    TYPE_CHOICES = [GLOBAL, PRIVATE]


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        user = self.scope["user"]
        logger.warning(f"{user.username} connected")
        # update chat_channel in database
        try:
            UserWebsockets.objects.update_chat_channel(user.user_websockets, self.channel_name)
        except UserWebsockets.DoesNotExist:
            UserWebsockets.objects.create(user, chat_channel=self.channel_name)
        # add websocket to global group (this can be a dedicated websocket)
        async_to_sync(self.channel_layer.group_add)(G_GROUP, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        user = self.scope["user"]
        # remove websocket from global group
        async_to_sync(self.channel_layer.group_discard)(G_GROUP, self.channel_name)
        # update chat_channel in database
        user_websockets = UserWebsockets.objects.get(user=user)
        UserWebsockets.objects.update_chat_channel(user_websockets, chat_channel="")
        logger.warning(f"[{close_code}]: {user.username} disconnected")

    def receive(self, text_data):
        user = self.scope["user"]
        data = json.loads(text_data)
        message_type = data.get("type", "")
        message_receiver = data.get("receiver", "")
        message_body = data.get("body", "")
        logger.warning(f"data: {data}")

        if message_type not in ValidTypes.TYPE_CHOICES:
            new_data = {"type": "error", "message": "Invalid values for type"}
            self.send(text_data=json.dumps(new_data))
            return
        elif message_body == "":
            new_data = {"type": "error", "message": "Invalid values for body"}
            self.send(text_data=json.dumps(new_data))
            return
        elif message_type == ValidTypes.GLOBAL:
            new_data = {"type": message_type, "sender": user.username, "message": message_body}
            async_to_sync(self.channel_layer.group_send)(
                G_GROUP,
                {
                    "type": "send",
                    "text": json.dumps(new_data),
                },
            )
            return

        # check if receiver exists in database
        try:
            receiver = User.objects.get(pk=message_receiver)
        except User.DoesNotExist:
            new_data = {"type": "error", "message": "Invalid values for receiver"}
            self.send(text_data=json.dumps(new_data))
        # check that receiver isn't the sender
        if receiver.username == user.username:
            new_data = {"type": "error", "message": "Invalid values for receiver"}
            self.send(text_data=json.dumps(new_data))
        # TODO: check if actual user is a friend of receiver and get the chat_id
        # TODO: store the message in the database
        # TODO: send the message back to the reciever if he is online

        # temp
        self.send(text_data=json.dumps({"message": message_body}))
