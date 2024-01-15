from django.urls import path
from chat import consumers

websocket_urlpatterns = [
    path("ws/chat/socket/", consumers.ChatConsumer.as_asgi()),
]
