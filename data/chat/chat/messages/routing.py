from django.urls import path
from messages import consumers

chat_urlpatterns = [
    path("ws/chat/socket/", consumers.ChatConsumer.as_asgi()),
]
