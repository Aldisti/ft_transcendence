from django.shortcuts import render
from django.conf import settings

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from authentication.permissions import IsUser

from base64 import b64decode
from json import loads

from requests import post as post_request
from requests import get as get_request

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
