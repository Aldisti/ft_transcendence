from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response

from users.models import Game, Participant, PongUser

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
    games = sorted(games, key=attrgetter("created"))
    # get sorted parts
    parts = [game.participant.filter(player_id = player.username).first() for game in games]
    # get sorted opponents
    opponents = [game.participant.exclude(player_id = player.username).first() for game in games]

    data = []
    for participant, opponent, game in zip(parts, opponents, games):
        match = {
            "opponent": opponent.player_id,
            "scores": [participant.stats.score, opponent.stats.score],
            "date": game.get_created(),
        }
        data.append(match)

    return Response(data, status=200)
