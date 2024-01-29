from django.conf import settings
from chat.models import Message
from accounts.models import UserWebsockets
from chat.utils import MessageTypes

class MessageBuilder:
    def __init__(self):
        self.msg_instance = None
        self.ready = False
        self.msg_type = MessageTypes.GLOBAL

    def patcher(self, message: Message):
        self.msg_instance = message
        self.msg_type = MessageTypes.GLOBAL
        self.ready = False
        return self

    def builder(self, sender: UserWebsockets):
        self.msg_instance = Message(from_user=sender)
        self.msg_type = MessageTypes.GLOBAL
        self.ready = False
        return self

    def set_msg_type(self, msg_type: str):
        if self.ready:
            return self
        self.msg_type = msg_type
        if msg_type not in MessageTypes.TYPE_CHOICES_LIST:
            self.msg_type = MessageTypes.ERROR
            self.msg_instance.body = "Invalid values for type"
            self.ready = True
        return self

    def set_msg_body(self, body: str):
        if self.ready:
            return self
        self.msg_instance.body = body
        if body == "" or len(body) > settings.MAX_MESSAGE_LENGTH: 
            self.msg_type = MessageTypes.ERROR
            self.msg_instance.body = "Invalid values for type"
        self.ready = True
        return self

    def error_msg(self, body: str):
        self.msg_type = MessageTypes.ERROR
        self.msg_instance.body = body
        self.ready = True
        return self

    def build(self) -> dict:
        return {"msg_type": self.msg_type, "message": self.msg_instance}
