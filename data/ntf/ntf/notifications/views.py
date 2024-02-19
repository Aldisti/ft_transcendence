from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from users.models import UserWebsockets

from notifications.models import Notification

import logging

import json

logger = logging.getLogger(__name__)

# Create your views here.


# url: /notification/group/
@api_view(['POST'])
def group_ntf(request):
    data = request.data
    body = data.get("body", "")
    if body == "":
        return Response({"message": "Not enough informations"}, status=400)
    Notification.objects.send_group_notification(body)
    return Response({"message": "Group notification sent"}, status=200)


# url: /notification/tournament_req/
@api_view(['POST'])
def tournament_req_ntf(request):
    logger.warning("TOURNAMENT REQ NTF")
    data = request.data
    try:
        requested = UserWebsockets.objects.get(pk=data.get("requested", ""))
    except UserWebsockets.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    body = data.get("body", "")
    if body == "":
        return Response({"message": "Invalid body"}, status=400)
    Notification.objects.send_tournament_req(requested, json.dumps(body))
    return Response({"message": "Tournament request notification sent"}, status=200)


# url: /notification/match_req/
@api_view(['POST'])
def match_req_ntf(request):
    data = request.data
    try:
        sender = UserWebsockets.objects.get(pk=data.get("sender", ""))
        requested = UserWebsockets.objects.get(pk=data.get("requested", ""))
    except UserWebsockets.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    if sender == requested:
        return Response({"message": "Invalid users"}, status=400)
    token = data.get("token", "")
    if token == "":
        return Response({"message": "Invalid token"}, status=400)
    Notification.objects.send_match_req(sender, requested, token)
    return Response({"message": "Match request notification sent"}, status=200)


# url: /notification/friends_req/
@api_view(['POST'])
def friends_req_ntf(request):
    data = request.data
    try:
        sender = UserWebsockets.objects.get(pk=data.get("sender", ""))
        requested = UserWebsockets.objects.get(pk=data.get("requested", ""))
    except UserWebsockets.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    if sender == requested:
        return Response({"message": "Invalid users"}, status=400)
    token = data.get("token", "")
    if token == "":
        return Response({"message": "Invalid token"}, status=400)
    Notification.objects.send_friend_req(sender, requested, token)
    return Response({"message": "Friends request notification sent"}, status=200)


# url: /notification/info/
@api_view(['POST'])
def info_ntf(request):
    data = request.data
    try:
        receiver = UserWebsockets.objects.get(pk=data.get("receiver", ""))
    except UserWebsockets.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    body = data.get("body", "")
    if body == "":
        return Response({"message": "Invalid body"}, status=400)
    Notification.objects.send_info_ntf(receiver, body)
    return Response({"message": "Info notification sent"}, status=200)


# url: /notification/alert/
@api_view(['POST'])
def alert_ntf(request):
    data = request.data
    try:
        receiver = UserWebsockets.objects.get(pk=data.get("receiver", ""))
    except UserWebsockets.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    body = data.get("body", "")
    if body == "":
        return Response({"message": "Invalid body"}, status=400)
    Notification.objects.send_alert_ntf(receiver, body)
    return Response({"message": "Alert notification sent"}, status=200)


# url: /notification/ban/
@api_view(['POST'])
def ban_ntf(request):
    data = request.data
    try:
        receiver = UserWebsockets.objects.get(pk=data.get("receiver", ""))
    except UserWebsockets.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    body = data.get("body", "")
    if body == "":
        return Response({"message": "Invalid body"}, status=400)
    Notification.objects.send_ban_ntf(receiver, body)
    return Response({"message": "Ban notification sent"}, status=200)
