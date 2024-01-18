from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from authentication.permissions import IsUser
from accounts.models import User
from friends.models import FriendsList
from notifications.models import Notification
from friends.utils import (create_chat_entities,
                           delete_chat_entities, 
                           get_users_from_friends)
from friends.serializers import FriendsSerializer

import logging

logger = logging.getLogger(__name__)

# Create your views here.

# TODO: the following two endpoints have the same incipit, try to reduce code

@api_view(['GET'])
@permission_classes([IsUser])
def make_friends_request(request):
    user = request.user
    r_username = request.query_params.get("username", "")
    # check that requested username
    if r_username == user.username:
        return Response({"message": "You're already friend with yourself"}, status=400)
    # take the requested user from database
    try:
        requested = User.objects.get(pk=r_username)
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    # retrieve friends from database
    friends = FriendsList.objects.get_friends(user, requested)
    if friends is None:
        friends = FriendsList.objects.create(user, requested, sender=user.username)
        # send a notification to user
        Notification.objects.send_friend_req(user, requested, friends.token)
        return Response({"message": "The request has been sent"}, status=200)
    elif friends.token == "":
        return Response({"message": "You're already a friend of this user"}, status=400)
    elif friends.sender == user.username:
        return Response({"message": "You're already sent a request to this user"}, status=400)
    # if the friends request is sent to someone that previously
    # sent a friends reqyest to this user, it will be accepted
    # without checking the token
    friends = FriendsList.objects.clear_token(friends)
    # create the chat entries for chat system
    create_chat_entities(friends)
    # send notification back to the requester
    Notification.objects.send_info_ntf(requested, f"{user.username} accepted your friends request")
    return Response({"message": f"You and {requested.username} are now friends!"}, status=200)


@api_view(['GET'])
@permission_classes([IsUser])
def delete_friends(request):
    user = request.user
    r_username = request.query_params.get("username", "")
    # check that requested username
    if r_username == user.username:
        return Response({"message": "You're already friend with yourself"}, status=400)
    # take the ex_friend user from database
    try:
        ex_friend = User.objects.get(pk=r_username)
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    # retrieve friends from database
    friends = FriendsList.objects.get_friends(user, ex_friend)
    if friends is None:
        return Response({"message": "You're already not friend of this user"}, status=400)
    if friends.token != "":
        friends.delete()
        return Response({"message": "Friends request deleted"}, status=200)
    # delete chat entities
    delete_chat_entities(friends)
    friends.delete()
    # send notification to the ex friend
    Notification.objects.send_info_ntf(ex_friend, f"{user.username} isn't no more your friend")
    return Response({"message": f"You and {ex_friend.username} are no more friends"}, status=200)

# TODO: the following endpoints have the same incipit, try to reduce code

@api_view(['GET'])
@permission_classes([IsUser])
def accept_friends_request(request):
    user = request.user
    token = request.query_params.get("token", "")
    if token == "":
        return Response({"messsage": "Bad query params"}, status=400)
    friends = FriendsList.objects.get_friends_by_token(token=token)
    if friends is None:
        return Response({"message": "Token not found"}, status=404)
    friends = FriendsList.objects.clear_token(friends)
    # create the chat entries for chat system
    create_chat_entities(friends)
    # send notification back to the requester
    requester = friends.user_2 if user == friends.user_1 else friends.user_1
    Notification.objects.send_info_ntf(requester, f"{user.username} accepted your friends request")
    return Response({"message": "Request accepted"}, status=200)


@api_view(['GET'])
@permission_classes([IsUser])
def reject_friends_request(request):
    user = request.user
    token = request.query_params.get("token", "")
    if token == "":
        return Response({"messsage": "Bad query params"}, status=400)
    friends = FriendsList.objects.get_friends_by_token(token=token)
    if friends is None:
        return Response({"message": "Token not found"}, status=404)
    requester = friends.user_2 if user == friends.user_1 else friends.user_1
    # delete friends request
    friends.delete()
    # send notification back to the requester
    Notification.objects.send_info_ntf(requester, f"{user.username} rejected your friends request")
    return Response({"message": "Request rejected"}, status=200)


@api_view(['GET'])
@permission_classes([IsUser])
def are_friends(request):
    user = request.user
    other_username = request.query_params.get("username", "")
    if other_username == user.username:
        return Response({"message": "You're already friend with yourself"}, status=400)
    try:
        other_user = User.objects.get(pk=other_username)
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    if not FriendsList.objects.are_friends(user, other_user):
        return Response({"is_friend": False}, status=200)
    return Response({"is_friend": True}, status=200)


@api_view(['GET'])
@permission_classes([IsUser])
def get_all_friends(request):
    user = request.user
    friends_list = FriendsList.objects.get_all_friends(user)
    users = get_users_from_friends(friends=friends_list, common_friend=user)
    friends_serializer = FriendsSerializer(users, many=True, context={"request": request})
    return Response(friends_serializer.data, status=200)
