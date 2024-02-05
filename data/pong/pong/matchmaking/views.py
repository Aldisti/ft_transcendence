from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response

from users.models import PongUser

from logging import getLogger


logger = getLogger(__name__)


@api_view(['GET', 'POST'])
def start_queue(request):
    return render(request, 'matchmaking.html')


@api_view(['POST'])
def generate_matchmaking_token(request) -> Response:
    username = request.data.get('username')
    if username == '':
        return Response(data={'message': 'Invalid JSON format'}, status=400)
    try:
        pong_user = PongUser.objects.get(pk=username)
    except PongUser.DoesNotExist:
        logger.warning(f"{username} not found")
        return Response(data={'message': 'user not found'}, status=404)
    pong_user = PongUser.objects.generate_ticket(pong_user)
    return Response(data={'ticket': pong_user.ticket}, status=200)


@api_view(['GET', 'POST'])
def test(request) -> Response:
    data = {
        'headers': request.headers,
        'body': request.data,
        'cookies': request.COOKIES,
        'user': str(request.user) or "None",
        'username': request.user.username,
        'role': request.user.role,
    }
    return Response(data=data)
