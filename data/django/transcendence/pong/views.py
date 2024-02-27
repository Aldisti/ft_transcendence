from django.shortcuts import render
from django.conf import settings

from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response

from transcendence.permissions import IsUser

from base64 import b64decode
from json import loads

from requests import post as post_request
from requests import get as get_request
from requests import delete as delete_request

from accounts.models import User

from operator import itemgetter

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
    # logger.warning(api_response.json()["next"].replace("pong", "localhost"))
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['GET'])
@permission_classes([IsUser])
def retrieve_tournament(request, tour_id):
    url = settings.MS_URLS['TOURNAMENT_RETRIEVE'].replace("<pk>", str(tour_id))
    api_response = get_request(url)
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['POST'])
@permission_classes([IsUser])
def create_tournament(request):
    user = request.user
    url = settings.MS_URLS['TOURNAMENT_CREATE'] + f"?username={user.username}"
    body = request.data
    api_response = post_request(url, json=body)
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['POST'])
@permission_classes([IsUser])
def register_tournament(request):
    user = request.user
    url = settings.MS_URLS['TOURNAMENT_REGISTER'] + f"?username={user.username}"
    body = request.data
    api_response = post_request(url, json=body)
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['POST'])
@permission_classes([IsUser])
def unregister_tournament(request):
    user = request.user
    url = settings.MS_URLS['TOURNAMENT_UNREGISTER'] + f"?username={user.username}"
    body = request.data
    api_response = post_request(url, json=body)
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['GET'])
@permission_classes([IsUser])
def get_schema_tournament(request, tournament_id):
    url = settings.MS_URLS['TOURNAMENT_GET_SCHEMA'].replace("<pk>", str(tournament_id))
    api_response = get_request(url)
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    # logger.warning(f"RESPONSE: {api_response.json()}")
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
    # get user from query params
    username = request.query_params.get("username", "")
    try:
        user = User.objects.get(pk=username)
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)

    game_url = settings.MS_URLS['GAME_GET_MATCHES'] + f"?username={user.username}"
    game_response = get_request(game_url)
    tournament_url = settings.MS_URLS['TOURNAMENT_GET_MATCHES'] + f"?username={user.username}"
    tournament_response = get_request(tournament_url)
    if game_response.status_code != 200 or tournament_response.status_code != 200:
        return Response({"message": "Databases desynchronized"}, status=500)

    # put together the two responses and sort
    tournament_matches = tournament_response.json()
    game_matches = game_response.json()
    matches = tournament_matches + game_matches
    matches = sorted(matches, key=itemgetter("date"), reverse=True)

    return Response(matches, status=200)


@api_view(['POST'])
@permission_classes([IsUser])
def send_match_req(request):
    """
    {"requested": "<username>"}
    """
    user = request.user
    url = settings.MS_URLS['SEND_MATCH_REQ'] + f"?username={user.username}"
    body = request.data
    api_response = post_request(url, json=body)
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['DELETE'])
@permission_classes([IsUser])
def delete_match_req(request):
    user = request.user
    url = settings.MS_URLS['DELETE_MATCH_REQ'] + f"?username={user.username}"
    api_response = delete_request(url)
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['POST'])
@permission_classes([IsUser])
def accept_match_req(request):
    """
    {"token": "<match_token>"}
    """
    user = request.user
    url = settings.MS_URLS['ACCEPT_MATCH_REQ'] + f"?username={user.username}"
    body = request.data
    api_response = post_request(url, json=body)
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['POST'])
@permission_classes([IsUser])
def reject_match_req(request):
    """
    {"token": "<match_token>"}
    """
    user = request.user
    url = settings.MS_URLS['REJECT_MATCH_REQ'] + f"?username={user.username}"
    body = request.data
    api_response = post_request(url, json=body)
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['GET'])
@permission_classes([IsUser])
@throttle_classes([])
def get_results(request):
    query_params = "?" + "&".join([f"{key}={value}" for key, value in request.query_params.items()])
    url = settings.MS_URLS["GAME_GET_RESULTS"] + query_params
    api_response = get_request(url)
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['GET'])
@permission_classes([IsUser])
@throttle_classes([])
def get_all_results(request):
    query_params = "?" + "&".join([f"{key}={value}" for key, value in request.query_params.items()])
    url = settings.MS_URLS["GAME_GET_ALL_RESULTS"] + query_params
    api_response = get_request(url)
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['GET'])
@permission_classes([IsUser])
@throttle_classes([])
def get_stats(request):
    username = request.query_params.get("username", "")
    url = settings.MS_URLS["GAME_GET_STATS"] + f"?username={username}"
    api_response = get_request(url)
    return Response(api_response.json(), status=api_response.status_code)
