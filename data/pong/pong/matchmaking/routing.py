from channels.routing import URLRouter
from matchmaking import consumers
from django.urls import path


urlpatterns = [
    path('ws/matchmaking/queue/', consumers.QueueConsumer.as_asgi()),
    path('ws/match/queue/', consumers.MatchConsumer.as_asgi()),
]
