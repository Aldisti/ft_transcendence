from django.shortcuts import render
from django.conf import settings

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from authentication.permissions import IsUser

from base64 import b64decode
from json import loads

from requests import post as post_request
from requests import get as get_request

from accounts.models import User

import logging

logger = logging.getLogger(__name__)


@api_view(['GET', 'POST'])
@permission_classes([])
def matchmaking(request):
    payload = request.COOKIES.get('refresh_token').split('.')[1]
    payload += '=' * (-len(payload) % 4)
    username = loads(b64decode(payload))['username']
    return render(request, 'matchmaking.html', context={'username': username})

    
@api_view(['GET'])
@permission_classes([IsUser])
def list_tournaments(request):
    query_params = "?" + "&".join([f"{key}={value}" for key, value in request.query_params.items()])
    url = settings.MS_URLS["TOURNAMENT_LIST"] + query_params
    api_response = get_request(url)
    # TODO: ask adi-stef
    #logger.warning(api_response.json()["next"].replace("pong", "localhost"))
    return Response(api_response.json(), status=api_response.status_code)
    
@api_view(['GET'])
@permission_classes([IsUser])
def retrieve_tournament(request, tour_id):
    url = settings.MS_URLS['TOURNAMENT_RETRIEVE'].replace("<pk>", str(tour_id))
    api_response = get_request(url)
    # TODO: ask adi-stef
    return Response(api_response.json(), status=api_response.status_code)

@api_view(['POST'])
@permission_classes([IsUser])
def create_tournament(request):
    user = request.user
    url = settings.MS_URLS['TOURNAMENT_CREATE'] + f"?username={user.username}"
    body = request.data
    api_response = post_request(url, json=body)
    # TODO: ask adi-stef
    return Response(api_response.json(), status=api_response.status_code)

@api_view(['POST'])
@permission_classes([IsUser])
def register_tournament(request):
    user = request.user
    url = settings.MS_URLS['TOURNAMENT_REGISTER'] + f"?username={user.username}"
    body = request.data
    api_response = post_request(url, json=body)
    # TODO: ask adi-stef
    return Response(api_response.json(), status=api_response.status_code)

@api_view(['POST'])
@permission_classes([IsUser])
def unregister_tournament(request):
    user = request.user
    url = settings.MS_URLS['TOURNAMENT_UNREGISTER'] + f"?username={user.username}"
    body = request.data
    api_response = post_request(url, json=body)
    # TODO: ask adi-stef
    return Response(api_response.json(), status=api_response.status_code)

@api_view(['GET'])
@permission_classes([IsUser])
def get_schema_tournament(request, tournament_id):
    user = request.user
    url = settings.MS_URLS['TOURNAMENT_GET_SCHEMA'].replace("<pk>", str(tournament_id))
    api_response = get_request(url)
    # TODO: ask adi-stef
    logger.warning(f"RESPONSE: {api_response.json()}")
    body = api_response.json()
    host = request.headers.get("Host", "")
    for layer in body:
        for participant in layer:
            if participant.get("empty", False):
                continue
            try:
                user = User.objects.get(pk=participant.get("username"))
                picture = f"{settings.PROTOCOL}://{host}{user.get_picture().url}"
            except User.DoesNotExist:
                return Response({"message": "databases between apps desynchronized"}, status=500)
            except ValueError:
                picture = None
            participant["picture"] = picture
    return Response(body, status=api_response.status_code)


@api_view(['GET'])
@permission_classes([IsUser])
def get_matches(request):
    user = request.user
    url = settings.MS_URLS['GAME_GET_MATCHES'] + f"?username={user.username}"
    api_response = get_request(url)
    return Response(api_response.json(), status=api_response.status_code)
