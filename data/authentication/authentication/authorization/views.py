
from django.core.exceptions import ValidationError
from django.conf import settings

from rest_framework import status
from rest_framework.decorators import APIView, api_view, permission_classes, throttle_classes
from rest_framework.response import Response

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Token
from .serializers import TokenPairSerializer

from authentication.throttles import HighLoadThrottle, MediumLoadThrottle, LowLoadThrottle
from authentication.permissions import IsActualUser, IsAdmin

from users.models import User
from users.serializers import UserSerializer

from datetime import datetime
import requests
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([])
@throttle_classes([HighLoadThrottle])
def login(request) -> Response:
    error_response = Response(data={
        'message': 'invalid username or password'
    }, status=400)
    user_serializer = UserSerializer(data=request.data)
    user_serializer.is_valid(raise_exception=True)
    try:
        user: User = User.objects.get(username=user_serializer.validated_data['username'])
    except User.DoesNotExist:
        return error_response
    if not user.check_password(user_serializer.validated_data['password']):
        return error_response
    # TODO: turn on this check in production
    # if not user.verified:
    #     return Response(data={'message': 'user not verified yet'}, status=400)
    if not user.active:
        return Response(data={'message': "user isn't active"}, status=400)
    # TODO: check for password reset token
    # UserTokens.objects.clear_password_token(user.user_tokens)
    if user.tfa:
        # TODO: generate tfa token making a GET request
        return Response(data={
            'token': '',
            'type': '',
        }, status=200)
    user = User.objects.update_last_login(user)
    refresh_token = TokenPairSerializer.get_token(user)
    exp = datetime.fromtimestamp(refresh_token['exp'], tz=settings.TZ) - datetime.now(tz=settings.TZ)
    response = Response(data={
        'access_token': str(refresh_token.access_token)
    }, status=200)
    response.set_cookie(
        key='refresh_token',
        value=str(refresh_token),
        max_age=exp.seconds,
        secure=False,
        httponly=True,
        samesite=None,
    )
    return response


@api_view(['POST'])
@throttle_classes([MediumLoadThrottle])
def logout(request) -> Response:
    error_response = Response(data={'message': 'invalid token'}, status=400)
    error_response.set_cookie(key="refresh_token", value="deleted", max_age=0)
    try:
        refresh_token: RefreshToken = RefreshToken(request.COOKIES.get('refresh_token'))
    except TokenError:
        return error_response
    exp = datetime.fromtimestamp(refresh_token['exp'], tz=settings.TZ)
    try:
        Token.objects.create(token=refresh_token['csrf'], exp=exp)
    except ValidationError or ValueError:
        return error_response
    if request.path.strip('/').split('/')[-1] == 'all':
        User.objects.update_last_logout(request.user)
    response = Response(status=200)
    response.set_cookie(key="refresh_token", value="deleted", max_age=0)
    return response


@api_view(['POST'])
@permission_classes([])
@throttle_classes([MediumLoadThrottle])
def refresh(request) -> Response:
    error_response = Response(status=403)
    error_response.set_cookie('refresh_token', 'deleted', max_age=0)
    if request.user.is_authenticated:
        error_response.data = {'message': 'cannot refresh with valid access token'}
        return error_response
    if 'refresh_token' not in request.COOKIES:
        return error_response
    try:
        refresh_token = RefreshToken(request.COOKIES.get('refresh_token'))
        try:
            if Token.objects.filter(token=refresh_token['csrf']).exists():
                raise TokenError()
        except KeyError:
            logger.warning(f"\n\ntoken received: {str(refresh_token)}\n\n")
            return Response(status=500)
    except TokenError:
        error_response.data = {'message': 'invalid refresh token'}
        return error_response
    try:
        user = User.objects.get(username=refresh_token['username'])
    except User.DoesNotExist:
        error_response.data = {'message': 'user not found'}
        error_response.status_code = 404
        return error_response
    if not user.active:
        error_response.data = {'message': "user is not active"}
        return error_response
    token_exp = datetime.fromtimestamp(refresh_token['exp'], tz=settings.TZ)
    if user.last_logout > user.last_login and user.last_logout > token_exp:
        return error_response
    return Response(data={'access_token': str(refresh_token.access_token)}, status=200)


@api_view(['GET'])
@permission_classes([])
@throttle_classes([LowLoadThrottle])
def retrieve_pubkey(request) -> Response:
    return Response(data={'public_key': settings.SIMPLE_JWT['VERIFYING_KEY']}, status=200)
