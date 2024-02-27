
from django.core.exceptions import ValidationError
from django.conf import settings

from rest_framework import status
from rest_framework.decorators import APIView, api_view, permission_classes
from rest_framework.response import Response

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken, Token

from two_factor_auth.models import UserTFA
from .models import JwtBlackList, PasswordResetToken, EmailVerificationToken
from .serializers import TokenPairSerializer

from users.models import User
from users.serializers import UserSerializer

from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


def get_exp(token: Token) -> timedelta:
    return datetime.fromtimestamp(token['exp'], tz=settings.TZ) - datetime.now(tz=settings.TZ)


@api_view(['POST'])
@permission_classes([])
def login(request) -> Response:
    """
    body: {'username': <username>, 'password': <password>}
    """
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
    if not user.active:
        return Response(data={'message': "user is not active"}, status=400)
    if user.has_password_token():
        user.password_token.delete()
    if user.has_tfa():
        user_tfa = UserTFA.objects.generate_url_token(user.user_tfa)
        return Response(data={
            'token': user_tfa.url_token,
            'type': user_tfa.otp_type,
        }, status=200)
    user = User.objects.update_last_login(user)
    refresh_token = TokenPairSerializer.get_token(user)
    return Response(data={
        'access_token': str(refresh_token.access_token),
        'refresh_token': str(refresh_token),
        'exp': get_exp(refresh_token).seconds,
    }, status=200)


@api_view(['POST'])
def logout(request) -> Response:
    """
    headers: 'Authorization: Bearer <access_token>'
    cookies: 'refresh_token=<refresh_token>'
    """
    error_response = Response(data={'message': 'invalid token'}, status=400)
    error_response.set_cookie(key="refresh_token", value="deleted", max_age=0)
    try:
        refresh_token: RefreshToken = RefreshToken(request.COOKIES.get('refresh_token'))
    except TokenError:
        return error_response
    exp = datetime.fromtimestamp(refresh_token['exp'], tz=settings.TZ)
    try:
        JwtBlackList.objects.create(token=refresh_token['csrf'], exp=exp)
    except ValidationError or ValueError or KeyError:
        return error_response
    if 'all' in request.path:
        User.objects.update_last_logout(request.user)
    return Response(status=200)


@api_view(['POST'])
@permission_classes([])
def refresh(request) -> Response:
    """
    cookies: 'refresh_token=<refresh_token>'
    """
    if 'refresh_token' not in request.COOKIES:
        return Response(data={'message': 'missing refresh token'}, status=403)
    try:
        refresh_token = RefreshToken(request.COOKIES.get('refresh_token'))
        try:
            if JwtBlackList.objects.filter(token=refresh_token['csrf']).exists():
                raise TokenError()
        except KeyError as e:
            # logger.warning(f"\n{str(e)}\ntoken received: {str(refresh_token)}\n\n")
            return Response(status=status.HTTP_418_IM_A_TEAPOT)
    except TokenError:
        return Response(data={'message': 'invalid refresh token'}, status=403)
    try:
        user = User.objects.get(username=refresh_token['username'])
    except User.DoesNotExist:
        return Response(data={'message': 'user not found'}, status=404)
    if not user.active:
        return Response(data={'message': "user is not active"}, status=403)
    token_iat = datetime.fromtimestamp(refresh_token['iat']) + timedelta(seconds=15)
    if user.last_login is None or (user.last_logout > user.last_login and user.last_logout > token_iat):
        return Response(data={'message': "invalid refresh token"}, status=403)
    return Response(data={'access_token': str(refresh_token.access_token)}, status=200)


@api_view(['GET'])
@permission_classes([])
def retrieve_pubkey(request) -> Response:
    return Response(data={'public_key': settings.SIMPLE_JWT['VERIFYING_KEY']}, status=200)


@api_view(['POST'])
@permission_classes([])
def password_recovery(request) -> Response:
    """
    body: {'username': <username>}
    """
    username = request.data.get('username', '')
    if username == '':
        return Response(data={'message': 'missing username'}, status=400)
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(data={'message': 'user not found'}, status=404)
    if user.has_password_token():
        user.password_token.delete()
    token = PasswordResetToken.objects.create(user=user)
    if user.has_tfa():
        user_tfa = UserTFA.objects.generate_url_token(user.user_tfa)
        return Response(
            data={'token': user_tfa.url_token, 'type': user_tfa.otp_type},
            status=200
        )
    return Response(data=token.to_data(), status=200)


@api_view(['POST'])
@permission_classes([])
def password_reset(request) -> Response:
    """
    body: {'token': <token>', 'password': <password>}
    """
    token = request.data.get('token', '')
    if token == '':
        return Response(data={'message': 'missing token'}, status=400)
    try:
        user = PasswordResetToken.objects.get(token=token).user
    except PasswordResetToken.DoesNotExist:
        return Response(data={'message': 'invalid token'}, status=400)
    user.password_token.delete()
    password = request.data.get('password', '')
    try:
        user = User.objects.reset_password(user, password)
    except ValueError as e:
        return Response(data={'message': str(e)}, status=400)
    User.objects.update_last_logout(user)
    return Response(status=200)


@api_view(['GET'])
def get_verification_details(request) -> Response:
    return Response(data=request.user.email_token.to_data(), status=200)
