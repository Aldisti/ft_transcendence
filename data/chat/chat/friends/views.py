from rest_framework.decorators import api_view
from rest_framework.response import Response

from users.models import UserWebsockets

from friends.models import FriendsList
from friends.utils import (create_chat_entities,
                           delete_chat_entities, 
                           get_users_from_friends)

from chat.producers import NotificationProducer

import logging

import json


logger = logging.getLogger(__name__)



def get_users(request) -> (Response, UserWebsockets, UserWebsockets):
    """
    This function parses the request and get two users from the database.
    The return is a tuple composed by the response used if something goes
    wrong and the two users, when the users get correctly retrieved from
    the database the response will be None
    """
    username = request.data.get("username", "")
    r_username = request.data.get("r_username", "")
    # check that requested username
    if r_username == username:
        return (Response({"message": "You're already friend with yourself"}, status=400), None, None)
    # take the requested user from database
    try:
        user = UserWebsockets.objects.get(pk=username)
        requested = UserWebsockets.objects.get(pk=r_username)
    except UserWebsockets.DoesNotExist:
        return (Response({"message": "User not found"}, status=404), None, None)
    return (None, user, requested)


def get_friends(request) -> (Response, UserWebsockets, UserWebsockets):
    """
    This function parses the request and get friends from the database.
    The return is a tuple composed by the response used if something goes
    wrong and the user and the friends, when the user and the friends get 
    correctly retrieved from the database the response will be None
    """
    username = request.data.get("username", "")
    try:
        user = UserWebsockets.objects.get(pk=username)
    except UserWebosockets.DoesNotExist:
        return (Response({"message": "User not found"}, status=404), None, None)
    token = request.data.get("token", "")
    if token == "":
        return (Response({"messsage": "Bad query params"}, status=400), None, None)
    friends = FriendsList.objects.get_friends_by_token(token=token)
    if friends is None:
        return (Response({"message": "Token not found"}, status=404), None, None)
    return (None, user, friends)


# Create your views here.

# TODO: the following two endpoints have the same incipit, try to reduce code

@api_view(['POST'])
def make_friends_request(request):
    """
    body: {"username": <username>, "r_username": <requested>}
    """
    response, user, requested = get_users(request)
    if response is not None:
        return response
    # retrieve friends from database
    friends = FriendsList.objects.get_friends(user, requested)
    if friends is None:
        friends = FriendsList.objects.create(user, requested, sender=user.username)
        # send a notification to user
        body = {"sender": user.username, "requested": requested.username, "token": friends.token}
        NotificationProducer().publish(method="friends_request_ntf", body=json.dumps(body))
        return Response({"message": "The request has been sent"}, status=200)
    elif friends.token == "":
        return Response({"message": "You're already a friend of this user"}, status=400)
    elif friends.sender == user.username:
        return Response({"message": "You're already sent a request to this user"}, status=400)
    # if the friends request is sent to someone that previously
    # sent a friends request to this user, it will be accepted
    # without checking the token
    friends = FriendsList.objects.clear_token(friends)
    # create the chat entries for chat system
    create_chat_entities(friends)
    # send notification back to the requester
    body = {"receiver": requested.username, "body": f"{user.username} accepted your friends request"}
    NotificationProducer().publish(method="info_ntf", body=json.dumps(body))
    return Response({"message": f"You and {requested.username} are now friends!"}, status=200)


@api_view(['POST'])
def delete_friends(request):
    """
    body: {"username": <username>, "r_username": <requested>}
    """
    response, user, ex_friend = get_users(request)
    if response is not None:
        return response
    friends = FriendsList.objects.get_friends(user, ex_friend)
    if friends is None:
        return Response({"message": "You're not a friend of this user"}, status=400)
    if friends.token != "":
        friends.delete()
        return Response({"message": "Friends request deleted"}, status=200)
    # delete chat entities
    delete_chat_entities(friends)
    friends.delete()
    # send notification to the ex friend
    body = {"receiver": ex_friend.username, "body": f"{user.username} is no more your friend"}
    NotificationProducer().publish(method="info_ntf", body=json.dumps(body))
    return Response({"message": f"You and {ex_friend.username} are no more friends"}, status=200)


# TODO: the following endpoints have the same incipit, try to reduce code

@api_view(['POST'])
def accept_friends_request(request):
    """
    body: {"username": <username>, "token": <token>}
    """
    response, user, friends = get_friends(request)
    if response is not None:
        return response
    friends = FriendsList.objects.clear_token(friends)
    # create the chat entries for chat system
    create_chat_entities(friends)
    # send notification back to the requester
    requester = friends.user_2 if user == friends.user_1 else friends.user_1
    body = {"receiver": requester.username, "body": f"{user.username} accepted your friends request"}
    NotificationProducer().publish(method="info_ntf", body=json.dumps(body))
    return Response({"message": "Request accepted"}, status=200)


@api_view(['POST'])
def reject_friends_request(request):
    """
    body: {"username": <username>, "token": <token>}
    """
    response, user, friends = get_friends(request)
    if response is not None:
        return response
    # send notification back to the requester
    requester = friends.user_2 if user == friends.user_1 else friends.user_1
    body = {"receiver": requester.username, "body": f"{user.username} rejected your friends request"}
    NotificationProducer().publish(method="info_ntf", body=json.dumps(body))
    # delete friends request
    friends.delete()
    return Response({"message": "Request rejected"}, status=200)


@api_view(['GET'])
def are_friends(request):
    """
    query_params: /?username=<username>&other_username=<username>
    """
    username = request.query_params.get("username", "")
    other_username = request.query_params.get("other_username", "")
    if other_username == username:
        return Response({"message": "You're already friend with yourself"}, status=400)
    try:
        user = UserWebsockets.objects.get(pk=username)
        other_user = UserWebsockets.objects.get(pk=other_username)
    except UserWebsockets.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    if not FriendsList.objects.are_friends(user, other_user):
        return Response({"is_friend": False}, status=200)
    return Response({"is_friend": True}, status=200)


@api_view(['GET'])
def get_all_friends(request):
    """
    query_params: /?username=<username>
    """
    username = request.query_params.get("username", "")
    try:
        user = UserWebsockets.objects.get(pk=username)
    except UserWebsockets.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    friends_list = FriendsList.objects.get_all_friends(user)
    users = get_users_from_friends(friends=friends_list, common_friend=user)
    usernames = [user.username for user in users]
    return Response({"friends": usernames}, status=200)
