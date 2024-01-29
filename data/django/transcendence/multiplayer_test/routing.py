from django.urls import path
from multiplayer_test import consumers

multiplayer_test_urlpatterns = [
    path("ws/game/socket/", consumers.MultiplayerConsumer.as_asgi()),
]
