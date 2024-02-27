from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics

from users.models import UserWebsockets, WebsocketTicket
from users.serializers import UserWebsocketsSerializer
from notifications.models import Notification

import logging


logger = logging.warning(__name__)


class CreateUser(generics.CreateAPIView):
    queryset = UserWebsockets.objects.all()
    serializer_class = UserWebsocketsSerializer


class DeleteUser(generics.DestroyAPIView):
    queryset = UserWebsockets.objects.all()
    serializer_class = UserWebsocketsSerializer


@api_view(['POST'])
def generate_ticket(request) -> Response:
    username = request.data.get('username')
    if username == '':
        return Response(data={'message': 'Invalid JSON format'}, status=400)
    try:
        user_websockets = UserWebsockets.objects.get(pk=username)
    except UserWebsockets.DoesNotExist:
        logger.warning(f"{username} not found")
        return Response(data={'message': 'user not found'}, status=404)
    websocket_ticket = WebsocketTicket.objects.create(user_websockets)
    return Response(data={'ticket': websocket_ticket.ticket}, status=201)
