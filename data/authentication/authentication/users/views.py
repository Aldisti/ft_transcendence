from django.core.exceptions import ValidationError
from django.conf import settings
from rest_framework import status

from rest_framework.decorators import APIView, api_view, permission_classes, throttle_classes
from rest_framework.response import Response

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

# from .models import JwtToken, UserTokens, WebsocketTicket
# from .throttles import LowLoadThrottle, MediumLoadThrottle

from .models import User
from .serializers import UserSerializer

from authentication.permissions import IsActualUser, IsAdmin

import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([])
@throttle_classes([])
def register_user(request) -> Response:
    logger.warning(f"\njson received{request.data}\n")
    user_serializer = UserSerializer(data=request.data)
    user_serializer.is_valid(raise_exception=True)
    try:
        User.objects.create_user(**user_serializer.validated_data)
    except ValidationError as e:
        if "already exists" in str(e):
            return Response(data={"message": "username or email already in use"}, status=400)
        return Response(data={"message": str(e)}, status=400)
    return Response(data=user_serializer.validated_data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsActualUser | IsAdmin])
@throttle_classes([])
def delete_user(request) -> Response:
    username = request.query_params.get('username', '')
    if username == '':
        return Response(data={'message': 'username is required'}, status=400)
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(data={'message': 'user not found'}, status=404)
    user.delete()
    return Response(status=200)


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


# @api_view(['GET', 'POST'])
# @permission_classes([])
# def test(request) -> Response:
#     from os import environ
#     return Response(data=environ)



