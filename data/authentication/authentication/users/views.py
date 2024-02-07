from django.core.exceptions import ValidationError
from django.conf import settings
from rest_framework import status

from rest_framework.decorators import APIView, api_view, permission_classes, throttle_classes
from rest_framework.response import Response

from two_factor_auth.models import UserTFA
from .models import User
from .serializers import UserSerializer

from authentication.throttles import LowLoadThrottle, MediumLoadThrottle, HighLoadThrottle
from authentication.permissions import IsActualUser, IsAdmin, IsModerator

import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([])
@throttle_classes([LowLoadThrottle])
def register_user(request) -> Response:
    """
    Request: {"username": <username>, "email": <email>, "password": <password>}
    """
    request.data.pop('role', '')
    user_serializer = UserSerializer(data=request.data)
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
    return Response(data=user_serializer.validated_data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsActualUser | IsAdmin])
@throttle_classes([LowLoadThrottle])
def delete_user(request) -> Response:
    """
    query params: {"username": <username>}
    """
    username = request.query_params.get('username', '')
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
def change_role(request) -> Response:
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
        User.objects.update_password(request.user, **request.data)
    except ValueError as e:
        return Response(data={'message': str(e)}, status=400)
    return Response(status=200)


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
        User.objects.update_email(request.user, **request.data)
    except ValueError as e:
        return Response(data={'error': str(e)}, status=400)
    return Response(status=200)


@api_view(['PATCH'])
@throttle_classes([MediumLoadThrottle])
def update_verified(request) -> Response:
    # TODO: well, the function's name says everything
    # maybe a token or more are needed
    pass


@api_view(['PATCH'])
@permission_classes([IsModerator])
@throttle_classes([MediumLoadThrottle])
def change_active(request) -> Response:
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


@api_view(['GET'])
@throttle_classes([MediumLoadThrottle])
def get_user(request, username: str) -> Response:
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(data={'message': 'user not found'}, status=404)
    user_serializer = UserSerializer(user)
    return Response(data=user_serializer.data, status=200)


# @api_view(['GET'])
# def get_queue_ticket(request) -> Response:
#     username = request.user.username
#     data = {'username': username}
#     logger.warning("#" * 50)
#     api_response = post_request(MATCHMAKING_TOKEN, json=data)
#     logger.warning("#" * 50)
#     if api_response.status_code != 200:
#         logger.warning(f"status code: {api_response.status_code}")
#         logger.warning(f"json: {api_response.json()}")
#         return Response(data={'message': f'api: {api_response.status_code}'}, status=503)
#     logger.warning(f"\n\n\n\n\nDJANGO API RESPONSE: {api_response.json()}")
#     return Response(data=api_response.json(), status=200)
