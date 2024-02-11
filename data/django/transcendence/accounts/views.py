from datetime import datetime

from django.core.exceptions import ValidationError
from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.generics import RetrieveDestroyAPIView, ListAPIView
from rest_framework.exceptions import APIException
from rest_framework import filters
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.paginations import MyPageNumberPagination
from accounts.serializers import CompleteUserSerializer, UploadImageSerializer, UserInfoSerializer
from accounts.models import User, UserInfo, UserGame
from accounts.validators import image_validator

from email_manager.email_sender import send_verification_email, send_verify_email

from authentication.permissions import IsActualUser, IsAdmin, IsModerator, IsUser

from requests import post as post_request
from requests import delete as delete_request
from requests import patch as patch_request

import logging
import pika
import os

from transcendence.decorators import get_func_credentials

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([])
def test(request):
    params = pika.ConnectionParameters(host=os.environ['RABBIT_HOST'], port=int(os.environ['RABBIT_PORT']))
    connection = pika.BlockingConnection(params)
    channel = connection.channel()

    routing_key = os.environ['NTF_ROUTING_KEY']
    message = "NOTIFICATION"
    channel.basic_publish(exchange=os.environ['EXCHANGE'], routing_key=routing_key, body=message)
    # logger.warning("sent")
    # channel.close()

    return Response(status=200)


@api_view(['POST'])
@permission_classes([IsUser])
def upload_profile_picture(request):
    user = request.user
    logger.warning(f"data: {request.data}")
    logger.warning(f"FILE: {request.FILES}")
    upload_image_serializer = UploadImageSerializer(data=request.data)
    if not upload_image_serializer.is_valid():
        return Response(status=400)
    upload_image_serializer.save_image(user, upload_image_serializer.validated_data)
    return Response({"message": "Profile picture uploaded"}, status=200)


@api_view(['POST'])
@permission_classes([])
def registration(request):
    # TODO: register user on the game app
    user_serializer = CompleteUserSerializer(data=request.data)
    user_serializer.is_valid(raise_exception=True)
    username = user_serializer.validated_data.get("username")
    email = user_serializer.validated_data.get("email")
    password = user_serializer.validated_data.get("password")
    data = {'username': username}

    # TODO: implement delete when something goes wrong

    # create user instance on ntf database
    api_response = post_request(settings.MS_URLS['NTF_REGISTER'], json=data)
    if api_response.status_code >= 300:
        return Response(data={'message': 'Something strange happened, contact devs'}, status=503)

    # create user instance on chat database
    api_response = post_request(settings.MS_URLS['CHAT_REGISTER'], json=data)
    if api_response.status_code >= 300:
        # delete from ntf db
        ntf_url = settings.MS_URLS['NTF_DELETE'].replace("<pk>", username)
        api_response = delete_request(ntf_url, json=data)
        return Response(data={'message': 'Something strange happened, contact devs'}, status=503)

    # create user instance on pong database
    api_response = post_request(settings.MS_URLS['PONG_REGISTER'], json=data)
    if api_response.status_code >= 300:
        # delete from ntf db
        ntf_url = settings.MS_URLS['NTF_DELETE'].replace("<pk>", username)
        api_response = delete_request(ntf_url, json=data)
        # delete from chat db
        chat_url = settings.MS_URLS['CHAT_DELETE'].replace("<pk>", username)
        api_response = delete_request(chat_url, json=data)
        return Response(data={'message': 'Something strange happened, contact devs'}, status=503)

    api_response = post_request(settings.MS_URLS['AUTH_REGISTER'],
                                json={'username': username, 'email': email, 'password': password})
    if api_response.status_code >= 300:
        # delete from ntf db
        ntf_url = settings.MS_URLS['NTF_DELETE'].replace("<pk>", username)
        api_response = delete_request(ntf_url, json=data)
        # delete from chat db
        chat_url = settings.MS_URLS['CHAT_DELETE'].replace("<pk>", username)
        api_response = delete_request(chat_url, json=data)
        # delete from pong db
        pong_url = settings.MS_URLS['PONG_DELETE'].replace("<pk>", username)
        api_response = delete_request(pong_url, json=data)
        return Response(data={'message': 'Something strange happened, contact devs'}, status=503)
    # create user instance on main database
    # TODO: validation error protection
    user = user_serializer.create(user_serializer.validated_data)
    # TODO: reduce time of registration
    # send_verification_email(user=user)
    send_verify_email(**api_response.json())
    serializer_response = CompleteUserSerializer(user)
    return Response(serializer_response.data, status=201)


@api_view(['PATCH'])
@permission_classes([IsAdmin])
@get_func_credentials
def change_role(request):
    """
    Request: {"username": <username>, "role": <[U, M]>}
    """
    user_serializer = CompleteUserSerializer(data=request.data)
    if not user_serializer.is_valid():
        return Response(status=400)
    user = user_serializer.update_role(user_serializer.validated_data)
    # auth server
    api_response = patch_request(
        settings.MS_URLS['AUTH']['UPDATE_ROLE'],
        headers=request.api_headers,
        json=request.data,
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    ###
    return Response({"username": user.username, "new_role": user.role}, status=200)


# TODO: the update password endpoint makes two database researches


@api_view(['PATCH'])
@permission_classes([IsUser])
@get_func_credentials
def update_password(request):
    """
    Request: {"password": <password>, "new_password"}
    """
    user = request.user
    data = request.data
    data["username"] = user.username
    user_serializer = CompleteUserSerializer(data=request.data)
    if not user_serializer.is_valid():
        return Response(status=400)
    try:
        user = user_serializer.update_password(user_serializer.validated_data)
    except ValueError as e:
        return Response({"message": "invalid password"}, status=400)
    # auth server
    api_response = patch_request(
        settings.MS_URLS['AUTH']['UPDATE_PASSWORD'],
        headers=request.api_headers,
        json=request.data
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    body = api_response.json()
    refresh_token = RefreshToken(body.pop('refresh_token'))
    exp = datetime.fromtimestamp(refresh_token['exp'], tz=settings.TZ) - datetime.now(tz=settings.TZ)
    response = Response(data=body, status=200)
    response.set_cookie(
        key='refresh_token',
        value=str(refresh_token),
        max_age=exp.seconds,
        secure=False,
        httponly=True,
        samesite=None,
    )
    return response


@api_view(['PATCH'])
@permission_classes([IsModerator])
@get_func_credentials
def change_active(request):
    """
    Request: {"username": <username>, "banned": <[True, False]>}
    """
    user_serializer = CompleteUserSerializer(data=request.data)
    if not user_serializer.is_valid():
        return Response(status=400)
    user = user_serializer.update_active(user_serializer.validated_data)
    # auth server
    api_response = patch_request(
        settings.MS_URLS['AUTH']['UPDATE_ACTIVE'],
        headers=request.api_headers,
        json=request.data,
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    ###
    return Response({"username": user.username, "banned": not user.active}, status=200)


@api_view(['PUT'])
# @permission_classes([IsUser])
def update_user_info(request):
    """
    Request: {"first_name": <first_name>, etc...}
    """

    user_info_serializer = UserInfoSerializer(data=request.data)
    user_info_serializer.is_valid(raise_exception=True)
    user_info = request.user.user_info
    updated_user_info = UserInfo.objects.update_info(user_info, **user_info_serializer.validated_data)
    return Response(UserInfoSerializer(updated_user_info).data, status=200)


class RetrieveDestroyUser(RetrieveDestroyAPIView):
    # permission_classes = [IsActualUser|IsAdmin]
    permission_classes = []
    queryset = User.objects.all()
    serializer_class = CompleteUserSerializer
    lookup_field = "username"

    def destroy(self, request, *args, **kwargs):
        logger.warning("MY DESTROY")
        logger.warning(f"KWARGS: {kwargs}")
        username = kwargs.get("username", "")
        if username != "":
            data = {'username': username}
            # delete from ntf db
            ntf_url = settings.MS_URLS['NTF_DELETE'].replace("<pk>", username)
            api_response = delete_request(ntf_url, json=data)
            # delete from chat db
            chat_url = settings.MS_URLS['CHAT_DELETE'].replace("<pk>", username)
            api_response = delete_request(chat_url, json=data)
            # delete from pong db
            pong_url = settings.MS_URLS['PONG_DELETE'].replace("<pk>", username)
            api_response = delete_request(pong_url, json=data)
            # delete from auth db
            headers = {'Authorization': request.headers.get('Authorization', '')}
            auth_url = settings.MS_URLS['AUTH']['DELETE'].replace("<pk>", username)
            api_response = delete_request(auth_url, headers=headers, json=request.data)
        return super().destroy(request, *args, **kwargs)


class ListUser(ListAPIView):
    queryset = User.objects.all()
    serializer_class = CompleteUserSerializer
    pagination_class = MyPageNumberPagination
    permission_classes = []
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["=username", "=email"]
    ordering_filters = ["username", "email"]
    ordering = ["username"]


@api_view(['GET'])
@permission_classes([])
def check_user(request):
    """
    http://<url>/?<username|email>=<username|mail>
    """
    if len(request.query_params) != 1:
        return Response({"message": "bad url formatting"}, status=400)
    username = request.query_params.get("username", "")
    email = request.query_params.get("email", "")
    found = User.objects.is_already_registered(username, email)
    return Response({"found": found}, status=200)


@api_view(['POST'])
def change_display_name(request) -> Response:
    display_name = request.data.get("display_name", "")
    if display_name == '':
        return Response({'message': 'invalid name'}, status=400)
    try:
        UserGame.objects.update_display_name(request.user.user_game, display_name)
    except ValidationError:
        return Response({'message': 'invalid name'}, status=400)
    return Response(status=200)
