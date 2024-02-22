from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response

from pong.producers import NotificationProducer

from users.models import PongUser, Game, Participant
from users.utils import Results

from game.serializers import serialize_game_matches

from tournaments.models import ParticipantTournament

from operator import attrgetter
from datetime import datetime, date, timedelta

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


@api_view(["GET"])
def get_results(request):
    player = request.pong_user
    if player is None:
        return Response({"message": "User not found"}, status=404)

    tournament = request.query_params.get("tournament", "")
    origin = datetime.combine(date.today(), datetime.min.time()) - timedelta(days=4)

    if tournament == "true":
        participants = ParticipantTournament.objects.filter(player=player, game__created__gte=origin)
    else:
        participants = Participant.objects.filter(player=player, game__created__gte=origin)

    daily_scores = {}
    for _ in range(5):
        end = origin + timedelta(days=1)
        daily_participants = participants.filter(game__created__gte=origin, game__created__lt=end)
        scores = {}
        for result in Results.RESULTS_LIST:
            scores[result] = 0
        for participant in daily_participants:
            stats = getattr(participant, "stats", None)
            result = getattr(stats, "result", None)
            if result is None:
                continue
            scores[result] += 1
        daily_scores[f"{origin.date()}"] = scores
        origin = end
    return Response(daily_scores, status=200) 


@api_view(["GET"])
def get_all_results(request):
    player = request.pong_user
    if player is None:
        return Response({"message": "User not found"}, status=404)

    tournament = request.query_params.get("tournament", "")

    if tournament == "true":
        participants = ParticipantTournament.objects.filter(player=player)
    else:
        participants = Participant.objects.filter(player=player)

    scores = {}
    for result in Results.RESULTS_LIST:
        scores[result] = 0
    for participant in participants:
        stats = getattr(participant, "stats", None)
        result = getattr(stats, "result", None)
        if result is None:
            scores[Results.LOSE] += 1
        scores[result] += 1
    return Response(scores, status=200) 


@api_view(["GET"])
def get_stats(request):
    player = request.pong_user
    if player is None:
        return Response({"message": "User not found"}, status=404)

    participants = Participant.objects.select_related("game").filter(player=player)
    games = [participant.game for participant in participants]
    total_victories = 0
    total_loses = 0
    total_draws = 0
    total_score = 0
    total_taken = 0
    for game in games:
        participant = game.participant.get(player_id=player.username)
        opponent = game.participant.exclude(player_id=player.username).first()
        stats = getattr(participant, "stats", None)
        score = getattr(stats, "score", 0)
        result = getattr(stats, "result", Results.LOSE)
        opponent_stats = getattr(opponent, "stats", None)
        opponent_score = getattr(opponent_stats, "score", 0)
        total_score += score
        total_taken += opponent_score
        if result == Results.WIN:
            total_victories += 1
        if result == Results.DRAW:
            total_draws += 1
        else:
            total_loses += 1
    pong_mastery = ((total_score / len(games) / 3) * 0.1)
    pong_mastery += ((1 - total_taken / len(games) / 3) * 0.1) 
    pong_mastery += ((total_victories / len(games)) * 0.4) 
    pong_mastery += ((1 - total_loses / len(games)) * 0.3) 
    pong_mastery += ((1 - total_draws / (len(games) ** 2)) * 0.1) 
    body = {
        "avg_score": total_score / len(games),
        "avg_taken": total_taken / len(games),
        "P.M.": pong_mastery * 11,
    }
    return Response(body, status=200)
