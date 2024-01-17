from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from accounts.models import User, UserWebsockets
from chat.models import Message, Chat
from chat.utils import G_GROUP, MessageTypes
from friends.models import FriendsList
import logging
import json
from datetime import datetime

logger = logging.getLogger(__name__)

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

    def chat_message(self, event):
        self.send(text_data=event["text"])

    def receive(self, text_data):
        user = self.scope["user"]
        data = json.loads(text_data)
        message_type = data.get("type", "")
        message_receiver = data.get("receiver", "")
        message_body = data.get("body", "")
        logger.warning(f"data: {data}")

        if message_type not in MessageTypes.TYPE_CHOICES_LIST:
            new_data = {"type": "error", "message": "Invalid values for type"}
            self.send(text_data=json.dumps(new_data))
            return
        elif message_body == "":
            new_data = {"type": "error", "message": "Invalid values for body"}
            self.send(text_data=json.dumps(new_data))
            return
        elif message_type == MessageTypes.GLOBAL:
            # TODO: sent_time is missing
            new_data = {
                "type": message_type,
                "sender": user.username,
                "message": message_body,
                "sent_time": datetime.now().strftime("%Y/%m/%d:%H.%M.%S")}
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
            logger.warning(f"receiver: {receiver}")
        except User.DoesNotExist:
            new_data = {"type": "error", "message": "Invalid values for receiver"}
            self.send(text_data=json.dumps(new_data))
        # check that receiver isn't the sender
        if receiver.username == user.username:
            new_data = {"type": "error", "message": "Invalid values for receiver"}
            self.send(text_data=json.dumps(new_data))
        # TODO: check if actual user is a friend of receiver
        if not FriendsList.objects.are_friends(user, receiver):
            new_data = {"type": "error", "message": "Invalid values for receiver, he isn't your friend"}
            self.send(text_data=json.dumps(new_data))
        # TODO: get the chat_id
        chat = Chat.objects.filter(chat_member__user_id=user.username).filter(chat_member__user_id=receiver.username)[0]
        # TODO: store the message in the database
        message = Message.objects.create(chat=chat, from_user=user.user_websockets, body=message_body)
        # TODO: check if the receicer is online
        rec_channel = receiver.user_websockets.chat_channel
        if rec_channel != "":
        # TODO: send the message back to the reciever if he is online
            json_data = message.to_json()
            logger.warning(f"data: {json_data}")
            async_to_sync(self.channel_layer.send)(
                rec_channel,
                {"type": "chat.message", "text": json.dumps(json_data)}
            )
        # temp
        #self.send(text_data=json.dumps({"message": message_body}))
