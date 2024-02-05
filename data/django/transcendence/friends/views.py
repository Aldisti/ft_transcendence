from django.conf import settings

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from accounts.models import User

from authentication.permissions import IsUser

from friends.serializers import FriendsSerializer

from requests import post as post_request
from requests import get as get_request

import logging

import json

logger = logging.getLogger(__name__)


# Create your views here.

# TODO: change api methods

@api_view(['GET'])
@permission_classes([IsUser])
def make_friends_request(request):
    user = request.user
    r_username = request.query_params.get("username", "")
    body = {"username": user.username, "r_username": r_username}
    api_response = post_request(settings.MS_URLS['FRIENDS_SEND_REQ'], json=body)
    # TODO: ask adi-stef
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['GET'])
@permission_classes([IsUser])
def delete_friends(request):
    user = request.user
    r_username = request.query_params.get("username", "")
    body = {"username": user.username, "r_username": r_username}
    api_response = post_request(settings.MS_URLS['FRIENDS_DELETE_REQ'], json=body)
    # TODO: ask adi-stef
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['GET'])
@permission_classes([IsUser])
def accept_friends_request(request):
    user = request.user
    token = request.query_params.get("token", "")
    body = {"username": user.username, "token": token}
    api_response = post_request(settings.MS_URLS['FRIENDS_ACCEPT_REQ'], json=body)
    # TODO: ask adi-stef
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['GET'])
@permission_classes([IsUser])
def reject_friends_request(request):
    user = request.user
    token = request.query_params.get("token", "")
    body = {"username": user.username, "token": token}
    api_response = post_request(settings.MS_URLS['FRIENDS_REJECT_REQ'], json=body)
    # TODO: ask adi-stef
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['GET'])
@permission_classes([IsUser])
def are_friends(request):
    user = request.user
    other_username = request.query_params.get("username", "")
    url = f"{settings.MS_URLS['FRIENDS_CHECK']}?username={user.username}&other_username={other_username}"
    api_response = get_request(url)
    # TODO: ask adi-stef
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['GET'])
@permission_classes([IsUser])
def get_all_friends(request):
    user = request.user
    url = f"{settings.MS_URLS['FRIENDS_ALL']}?username={user.username}"
    api_response = get_request(url)
    if api_response.status_code != 200:
        return Response(api_response.json(), status=api_response.status_code)
    # TODO: ask adi-stef
    usernames = api_response.json()['friends']
    friends = [User.objects.get(pk=username) for username in usernames]
    friends_serializer = FriendsSerializer(friends, many=True, context={"request": request})
    return Response(friends_serializer.data, status=api_response.status_code)
