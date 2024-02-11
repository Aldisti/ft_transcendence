from django.core.exceptions import ValidationError
from django.conf import settings
from rest_framework import status

from rest_framework.decorators import APIView, api_view, permission_classes, throttle_classes
from rest_framework.response import Response

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from email_manager.email_sender import send_password_reset_email
from transcendence.decorators import get_func_credentials
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


@api_view(['POST'])
@permission_classes([])
@throttle_classes([MediumLoadThrottle])
def login(request) -> Response:
    api_response = post_request(settings.MS_URLS['AUTH']['LOGIN'], json=request.data)
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    body = api_response.json()
    if 'token' in body:
        return Response(data=body, status=200)
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


@api_view(['POST'])
@throttle_classes([LowLoadThrottle])
@get_func_credentials
def logout(request) -> Response:
    url = settings.MS_URLS['AUTH']['LOGOUT']
    if request.path.endswith('all/'):
        url = settings.MS_URLS['AUTH']['LOGOUT_ALL']
    api_response = post_request(url, headers=request.api_headers, cookies=request.api_cookies)
    if api_response.status_code != 200:
        response = Response(data=api_response.json(), status=api_response.status_code)
    else:
        response = Response(status=200)
    response.set_cookie('refresh_token', 'deleted', max_age=0)
    return response


@api_view(['POST'])
@permission_classes([])
@throttle_classes([MediumLoadThrottle])
def refresh(request) -> Response:
    if request.user.is_authenticated:
        return Response(data={'message': 'access_token not expired yet'}, status=400)
    cookies = {'refresh_token': request.COOKIES.get('refresh_token')}
    api_response = post_request(settings.MS_URLS['AUTH']['REFRESH'], cookies=cookies)
    response = Response(data=api_response.json(), status=api_response.status_code)
    if api_response.status_code != 200:
        response.set_cookie('refresh_token', 'deleted', max_age=0)
    return response


@api_view(['POST'])
@permission_classes([])
@throttle_classes([])
def password_recovery(request) -> Response:
    api_response = post_request(settings.MS_URLS['AUTH']['PASSWORD_RECOVERY'], json=request.data)
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    kwargs = api_response.json()
    if 'url_token' in kwargs:
        return Response(data=kwargs, status=200)
    send_password_reset_email(**kwargs)
    return Response(status=200)


@api_view(['POST'])
@permission_classes([])
@throttle_classes([])
def password_reset(request) -> Response:
    body = request.data
    body.update({'token': request.query_params.get('token', '')})
    api_response = post_request(settings.MS_URLS['AUTH']['PASSWORD_RESET'], json=body)
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    return Response(status=200)



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
