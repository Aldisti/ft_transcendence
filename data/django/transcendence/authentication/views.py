from django.core.exceptions import ValidationError
from django.conf import settings

from rest_framework.decorators import APIView, api_view, permission_classes, throttle_classes
from rest_framework.response import Response

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken


from two_factor_auth.models import UserTFA

# TODO: move url in main setting
from .models import JwtToken, UserTokens, WebsocketTicket
from .throttles import LowLoadThrottle, MediumLoadThrottle
from .serializers import TokenPairSerializer
from .settings import MATCHMAKING_TOKEN
from .permissions import IsUser

from accounts.models import User
from accounts.serializers import UserSerializer

from requests import post as post_request
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([IsUser])
def generate_ntf_ticket(request) -> Response:
    user = request.user
    #websocket_ticket = WebsocketTicket.objects.create(user.user_tokens)
    data = {"username": user.username}
    api_response = post_request(settings.MS_URLS['NTF_TICKET'], json=data)
    if api_response.status_code >= 300:
        return Response(api_response.json(), status=503)
    return Response(api_response.json(), status=200)


@api_view(['GET'])
@permission_classes([IsUser])
def generate_chat_ticket(request) -> Response:
    user = request.user
    #websocket_ticket = WebsocketTicket.objects.create(user.user_tokens)
    data = {"username": user.username}
    api_response = post_request(settings.MS_URLS['CHAT_TICKET'], json=data)
    if api_response.status_code >= 300:
        return Response(api_response.json(), status=503)
    return Response(api_response.json(), status=200)


class LoginView(APIView):
    throttle_classes = [MediumLoadThrottle]
    permission_classes = []

    def post(self, request) -> Response:
        error_response = Response(data={
            'message': 'invalid username or password'
        }, status=400)
        user_serializer = UserSerializer(data=request.data)
        user_serializer.is_valid(raise_exception=True)
        try:
            user = User.objects.get(pk=user_serializer.validated_data['username'])
        except User.DoesNotExist:
            return error_response
        if not user.check_password(user_serializer.validated_data['password']):
            return error_response
        # TODO: turn back on this check
        # if not user.verified:
        #     return Response(data={'message': 'user not verified yet'}, status=400)
        if not user.active:
            return Response(data={'message': "user isn't active"}, status=400)
        UserTokens.objects.clear_password_token(user.user_tokens)
        if user.user_tfa.is_active():
            user_tfa = UserTFA.objects.generate_url_token(user.user_tfa)
            return Response(data={
                'token': user_tfa.url_token,
                'type': user_tfa.type,
            }, status=200)
        user = User.objects.update_last_login(user)
        refresh_token = TokenPairSerializer.get_token(user)
        # TODO: timezone thing
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
@throttle_classes([LowLoadThrottle])
def logout(request) -> Response:
    error_response = Response(data={'message': 'invalid token'}, status=400)
    error_response.set_cookie(key="refresh_token", value="deleted", max_age=0)
    try:
        refresh_token = RefreshToken(request.COOKIES.get('refresh_token'))
    except TokenError:
        return error_response
    try:
        JwtToken.objects.create(refresh_token)
    except TokenError or ValidationError:
        return error_response
    if request.path.strip("/").split('/')[-1] == 'all':
        User.objects.update_last_logout(request.user)
    response = Response(status=200)
    response.set_cookie(key="refresh_token", value="deleted", max_age=0)
    return response


class RefreshView(APIView):
    throttle_classes = [MediumLoadThrottle]
    permission_classes = []

    def get(self, request) -> Response:
        error_response = Response(status=403)
        error_response.set_cookie('refresh_token', 'deleted', max_age=0)
        if request.user.is_authenticated:
            return Response(data={
                'message': 'cannot refresh with valid access token'
            }, status=400)
        try:
            refresh_token = RefreshToken(request.COOKIES.get('refresh_token'))
            if refresh_token is None:
                raise TokenError()
            try:
                if JwtToken.objects.filter(token=refresh_token['csrf']).exists():
                    raise TokenError()
            except KeyError:
                logger.warning(f"token received: {str(refresh_token)}")
        except TokenError:
            error_response.data = {'message': 'invalid refresh token'}
            return error_response
        try:
            user = User.objects.get(pk=refresh_token['username'])
        except User.DoesNotExist:
            error_response.data = {'message': 'user not found'}
            error_response.status_code = 404
            return error_response
        if not user.active:
            error_response.data({'message': "user isn't active"})
            return error_response
        # TODO: timezone thing
        token_exp = datetime.fromtimestamp(refresh_token['exp'], tz=settings.TZ)
        if user.last_logout > user.last_login and user.last_logout > token_exp:
            return error_response
        return Response({'access_token': str(refresh_token.access_token)}, status=200)


@api_view(['GET'])
def get_queue_ticket(request) -> Response:
    username = request.user.username
    data = {'username': username}
    #logger.warning("#" * 50)
    api_response = post_request(MATCHMAKING_TOKEN, json=data)
    #logger.warning("#" * 50)
    if api_response.status_code != 200:
        #logger.warning(f"status code: {api_response.status_code}")
        #logger.warning(f"json: {api_response.json()}")
        return Response(data={'message': f'api: {api_response.status_code}'}, status=503)
    #logger.warning(f"\n\n\n\n\nDJANGO API RESPONSE: {api_response.json()}")
    return Response(data=api_response.json(), status=200)


@api_view(['GET'])
@permission_classes([])
@throttle_classes([LowLoadThrottle])
def retrieve_pubkey(request) -> Response:
    return Response(data={'public_key': settings.SIMPLE_JWT['VERIFYING_KEY']}, status=200)


# @api_view(['GET', 'POST'])
# @permission_classes([])
# def test(request) -> Response:
#     from os import environ
#     return Response(data=environ)
