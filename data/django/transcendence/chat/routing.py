from django.urls import path
from chat import consumers

chat_urlpatterns = [
    path("ws/chat/socket/", consumers.ChatConsumer.as_asgi()),
]
