from django.urls import path
from tournaments import consumers

tournaments_urlpatterns = [
    path("ws/tournament/socket/", consumers.TournamentConsumer.as_asgi()),
]
