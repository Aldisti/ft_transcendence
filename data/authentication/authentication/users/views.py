from time import sleep

from django.core.exceptions import ValidationError
from django.conf import settings
from rest_framework import filters

from rest_framework import status
from rest_framework import pagination

from rest_framework.generics import ListAPIView 
from rest_framework.decorators import APIView, api_view, permission_classes, throttle_classes
from rest_framework.response import Response

from authorization.models import EmailVerificationToken
from authorization.serializers import TokenPairSerializer
from authorization.views import get_exp
from two_factor_auth.models import UserTFA
from .models import User
from .serializers import UserSerializer, ListUserSerializer
from .filters import MyFilterBackend

from authentication.throttles import LowLoadThrottle, MediumLoadThrottle, HighLoadThrottle
from authentication.permissions import IsActualUser, IsAdmin, IsModerator

import logging


logger = logging.getLogger(__name__)


class MyPageNumberPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'size'
    max_page_size = 10


@api_view(['POST'])
@permission_classes([])
def register_user(request) -> Response:
    """
    Request: {"username": <username>, "email": <email>, "password": <password>}
    """
    # logger.warning(f"\n{request.data}\n")
    data = request.data.copy()
    data.pop('role', '')
    user_serializer = UserSerializer(data=data)
    user_serializer.is_valid(raise_exception=True)
    try:
        user = User.objects.create_user(**user_serializer.validated_data)
    except ValidationError as e:
        if "already exists" in str(e):
            return Response(data={"message": "username or email already in use"}, status=400)
        return Response(data={"message": str(e)}, status=400)
    except ValueError as e:
        return Response(data={"message": str(e)}, status=400)
    except TypeError as e:
        return Response(data={"message": str(e)}, status=400)
    UserTFA.objects.create(user=user)
    email_token = EmailVerificationToken.objects.create(user=user)
    return Response(data=email_token.to_data(), status=201)


@api_view(['DELETE'])
@permission_classes([IsActualUser | IsAdmin])
@throttle_classes([LowLoadThrottle])
def delete_user(request, username: str) -> Response:
    """
    url param: <username>
    """
    if username == '':
        return Response(data={'message': 'username is required'}, status=400)
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(data={'message': 'user not found'}, status=404)
    user.delete()
    return Response(status=200)


@api_view(['PATCH'])
@permission_classes([IsAdmin])
@throttle_classes([LowLoadThrottle])
def update_role(request) -> Response:
    """
    body: {"username": <username>, "role": <[U, M]>}
    """
    username = request.data.get('username', '')
    role = request.data.get('role', '')
    if username == '' or role == '':
        return Response(data={'message': 'missing username or role'}, status=400)
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(data={'message': 'user not found'}, status=404)
    try:
        User.objects.update_role(user, role)
    except ValueError as e:
        return Response(data={'message': str(e)}, status=400)
    return Response(status=200)


@api_view(['PATCH'])
@throttle_classes([MediumLoadThrottle])
def update_password(request) -> Response:
    """
    body: {"password": <password>, "new_password": <new_password>}
    """
    try:
        user = User.objects.update_password(request.user, **request.data)
    except ValueError as e:
        return Response(data={'message': str(e)}, status=400)
    user = User.objects.update_last_logout(user)
    refresh_token = TokenPairSerializer.get_token(user)
    return Response(data={
        'access_token': str(refresh_token.access_token),
        'refresh_token': str(refresh_token),
        'exp': get_exp(refresh_token).seconds,
    }, status=200)


@api_view(['PATCH'])
@throttle_classes([HighLoadThrottle])
def update_username(request) -> Response:
    """
    body: {"username": <username>, "password": <password>}
    """
    try:
        User.objects.update_username(request.user, **request.data)
    except ValueError as e:
        return Response(data={'error': str(e)}, status=400)
    return Response(status=200)


@api_view(['PATCH'])
@throttle_classes([MediumLoadThrottle])
def update_email(request) -> Response:
    """
    body: {"email": <email>, "password": <password>}
    """
    try:
        user = User.objects.update_email(request.user, **request.data)
    except ValueError as e:
        return Response(data={'error': str(e)}, status=400)
    UserTFA.objects.deactivate(user.user_tfa)
    return Response(status=200)


@api_view(['PATCH'])
@permission_classes([IsModerator])
@throttle_classes([MediumLoadThrottle])
def update_active(request) -> Response:
    """
    body: {"username": <username>, "banned": <[True, False]>}
    """
    username = request.data.get('username', '')
    if username == '':
        return Response(data={'message': 'missing username'}, status=400)
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(data={'message': 'user not found'}, status=404)
    try:
        User.objects.update_active(user, request.data['banned'])
    except ValueError as e:
        return Response(data={'message': str(e)}, status=400)
    return Response(status=200)


@api_view(['POST'])
@permission_classes([])
def verify_email(request) -> Response:
    """
    body: {'token': <token>}
    """
    token = request.data.get('token', '')
    if token == '':
        return Response(data={'message': 'missing token'}, status=400)
    try:
        email_token = EmailVerificationToken.objects.get(token=token)
    except EmailVerificationToken.DoesNotExist:
        return Response(data={'message': 'invalid token'}, status=400)
    User.objects.update_verified(email_token.user, True)
    email_token.delete()
    return Response(status=200)


@api_view(['GET'])
@throttle_classes([MediumLoadThrottle])
def get_user(request, username: str) -> Response:
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(data={'message': 'user not found'}, status=404)
    user_serializer = UserSerializer(user)
    return Response(data=user_serializer.data, status=200)

class ListUser(ListAPIView):
    queryset = User.objects.all()
    serializer_class = ListUserSerializer
    pagination_class = MyPageNumberPagination
    #permission_classes = [IsModerator]
    permission_classes = []
    throttles_classes = [MediumLoadThrottle]
    filter_backends = [MyFilterBackend, filters.OrderingFilter]
    search_fields = ["username", "role"]
    bool_fields = ["active"]
    ordering_filters = ["username"]
    ordering = ["username"]

