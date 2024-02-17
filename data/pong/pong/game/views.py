from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response

from pong.producers import NotificationProducer

from users.models import PongUser, Game, Participant

from game.serializers import serialize_game_matches

from operator import attrgetter

import json
import logging


logger = logging.getLogger(__name__)


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


@api_view(["POST"])
def send_match_request(request):
    """
    {'requested': <username>}
    """
    player = request.pong_user
    if player is None:
        return Response({"message": "User not found"}, status=404)

    try:
        username = request.data.get("requested", "")
        if username == player.username:
            return Response({"message": "Invalid user"}, status=400)
        requested = PongUser.objects.get(pk=username)
    except PongUser.DoesNotExist:
        return Response({"message": "Requested not found"}, status=404)

    # generate tickets
    player = PongUser.objects.generate_match_token(player)

    # send notification
    body = {"sender": player.username, "requested": requested.username, "token": player.match_token}
    NotificationProducer().publish("match_request_ntf", json.dumps(body))

    # send back response
    return Response({"token": player.match_token}, status=200)


@api_view(["DELETE"])
def delete_match_request(request):
    player = request.pong_user
    if player is None:
        return Response({"message": "User not found"}, status=404)

    # delete token
    PongUser.objects.delete_match_token(player)

    return Response({"message": "request deleted"}, status=200)


@api_view(["POST"])
def accept_match_request(request):
    """
    {'token': <token>}
    """
    player = request.pong_user
    if player is None:
        return Response({"message": "User not found"}, status=404)

    try:
        token = request.data.get("token", "false")
        if player.match_token == token:
            return Response({"message": "User already accepted this request"}, status=400)
        requester = PongUser.objects.get(match_token=token)
    except PongUser.DoesNotExist:
        return Response({"message": "Invalid token"}, status=400)

    # save token in actual user
    PongUser.objects.update_match_token(player, token)

    # send alert notification to other user
    body = {"receiver": requester.username, "body": f"A new foe has appeared: {player.username}"}
    NotificationProducer().publish("alert_ntf", json.dumps(body))

    # responde back to user
    return Response({"token": token}, status=200)


@api_view(["POST"])
def reject_match_request(request):
    """
    {'token': <token>}
    """
    player = request.pong_user
    if player is None:
        return Response({"message": "User not found"}, status=404)

    try:
        token = request.data.get("token", "false")
        if player.match_token == token:
            return Response({"message": "User already accepted this request"}, status=400)
        requester = PongUser.objects.get(match_token=token)
    except PongUser.DoesNotExist:
        return Response({"message": "Invalid token"}, status=400)

    # delete token in requester
    PongUser.objects.delete_match_token(requester)

    # send alert notification to other user
    body = {"receiver": requester.username, "body": f"{player.username} rejected your request"}
    NotificationProducer().publish("alert_ntf", json.dumps(body))

    # responde back to user
    return Response({"message": "Match request rejected"}, status=200)
