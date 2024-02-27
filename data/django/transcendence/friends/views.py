from django.conf import settings

from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response

from accounts.models import User

from transcendence.permissions import IsUser
from transcendence.throttles import MediumLoadThrottle, LowLoadThrottle

from friends.serializers import FriendsSerializer

from requests import post as post_request
from requests import get as get_request

import logging

logger = logging.getLogger(__name__)


# TODO: change api methods
@api_view(['GET'])
@permission_classes([IsUser])
@throttle_classes([MediumLoadThrottle])
def make_friends_request(request):
    user = request.user
    r_username = request.query_params.get("username", "")
    body = {"username": user.username, "r_username": r_username}
    api_response = post_request(settings.MS_URLS['FRIENDS_SEND_REQ'], json=body)
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['GET'])
@permission_classes([IsUser])
@throttle_classes([MediumLoadThrottle])
def delete_friends(request):
    user = request.user
    r_username = request.query_params.get("username", "")
    body = {"username": user.username, "r_username": r_username}
    api_response = post_request(settings.MS_URLS['FRIENDS_DELETE_REQ'], json=body)
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['GET'])
@permission_classes([IsUser])
@throttle_classes([MediumLoadThrottle])
def accept_friends_request(request):
    user = request.user
    token = request.query_params.get("token", "")
    body = {"username": user.username, "token": token}
    api_response = post_request(settings.MS_URLS['FRIENDS_ACCEPT_REQ'], json=body)
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['GET'])
@permission_classes([IsUser])
@throttle_classes([MediumLoadThrottle])
def reject_friends_request(request):
    user = request.user
    token = request.query_params.get("token", "")
    body = {"username": user.username, "token": token}
    api_response = post_request(settings.MS_URLS['FRIENDS_REJECT_REQ'], json=body)
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['GET'])
@permission_classes([IsUser])
@throttle_classes([MediumLoadThrottle])
def are_friends(request):
    user = request.user
    other_username = request.query_params.get("username", "")
    url = f"{settings.MS_URLS['FRIENDS_CHECK']}?username={user.username}&other_username={other_username}"
    api_response = get_request(url)
    return Response(api_response.json(), status=api_response.status_code)


@api_view(['GET'])
@permission_classes([IsUser])
@throttle_classes([LowLoadThrottle])
def get_all_friends(request):
    user = request.user
    url = f"{settings.MS_URLS['FRIENDS_ALL']}?username={user.username}"
    api_response = get_request(url)
    if api_response.status_code != 200:
        return Response(api_response.json(), status=api_response.status_code)
    # logger.warning(f"RESPONSE: {api_response.json()}")
    usernames = [data["username"] for data in api_response.json()]
    friends = [User.objects.get(pk=username) for username in usernames]
    friends_serializer = FriendsSerializer(friends, many=True, context={"request": request})
    json_response = friends_serializer.data
    protocol = request.headers.get('X-Forwarded-Proto', settings.PROTOCOL)
    for data, ser_data in zip(api_response.json(), json_response):
        ser_data["status"] = data["status"]
        if ser_data["picture"] is not None:
            ser_data["picture"] = ser_data["picture"].replace("http", protocol)
    return Response(json_response, status=api_response.status_code)
