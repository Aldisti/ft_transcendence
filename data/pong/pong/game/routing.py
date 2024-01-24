from django.urls import path
from game import consumers

game_urlpatterns = [
    path("ws/game/socket/", consumers.PongConsumer.as_asgi()),
]
