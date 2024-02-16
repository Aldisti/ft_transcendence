from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response

from users.models import Game, Participant

from game.serializers import serialize_game_matches

from operator import attrgetter

# Create your views here.

@api_view(["GET"])
def get_matches(request):
    player = request.pong_user
    if player is None:
        return Response({"message": "User not found"}, status = 404)

    # get participants entities
    parts = player.participant.all()
    # get all games and sort
    games = [part.game for part in parts]
    games = sorted(games, key=attrgetter("created"), reverse=True)
    # get sorted parts
    parts = [game.participant.filter(player_id = player.username).first() for game in games]
    # get sorted opponents
    opponents = [game.participant.exclude(player_id = player.username).first() for game in games]

    # serialize matches
    data = serialize_game_matches(parts, opponents, games)

    return Response(data, status=200)
