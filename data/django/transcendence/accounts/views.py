from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.generics import RetrieveDestroyAPIView, ListAPIView
from rest_framework.exceptions import APIException
from rest_framework import filters
from accounts.paginations import MyPageNumberPagination
from accounts.serializers import CompleteUserSerializer, UploadImageSerializer, UserInfoSerializer
from accounts.models import User, UserInfo
from friends.models import FriendsList
from accounts.validators import image_validator
from email_manager.email_sender import send_verification_email
from authentication.permissions import IsActualUser, IsAdmin, IsModerator, IsUser

import logging

logger = logging.getLogger(__name__)


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
    user_serializer = CompleteUserSerializer(data=request.data)
    user_serializer.is_valid(raise_exception=True)
    user = user_serializer.create(user_serializer.validated_data)
    send_verification_email(user=user)
    serializer_response = CompleteUserSerializer(user)
    return Response(serializer_response.data, status=201)


@api_view(['PATCH'])
@permission_classes([IsAdmin])
def change_role(request):
    """
    Request: {"username": <username>, "role": <[U, M]>}
    """
    user_serializer = CompleteUserSerializer(data=request.data)
    if not user_serializer.is_valid():
        return Response(status=400)
    user = user_serializer.update_role(user_serializer.validated_data)
    return Response({"username": user.username, "new_role": user.role}, status=200)


# TODO: the update password endpoint makes two database researches 

@api_view(['PATCH'])
@permission_classes([IsUser])
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
    return Response({"message": "password updated"}, status=200)


@api_view(['PATCH'])
@permission_classes([IsModerator])
def change_active(request):
    """
    Request: {"username": <username>, "banned": <[True, False]>}
    """
    user_serializer = CompleteUserSerializer(data=request.data)
    if not user_serializer.is_valid():
        return Response(status=400)
    user = user_serializer.update_active(user_serializer.validated_data)
    return Response({"username": user.username, "banned": not user.active}, status=200)

@api_view(['PUT'])
#@permission_classes([IsUser])
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
    permission_classes = [IsActualUser|IsAdmin]
    permission_classes = []
    queryset = User.objects.all()
    serializer_class = CompleteUserSerializer
    lookup_field = "username"


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
