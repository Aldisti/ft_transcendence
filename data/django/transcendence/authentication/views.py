import logging

from django.conf import settings
from requests import get
from requests import post
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response

from email_manager.email_sender import send_password_reset_email
from transcendence.decorators import get_func_credentials
from transcendence.permissions import IsUser
from transcendence.throttles import LowLoadThrottle, MediumLoadThrottle, EmailThrottle, HighLoadThrottle

logger = logging.getLogger(__name__)


def post_request(*args, **kwargs):
    return post(*args, **kwargs, verify=False)


def get_request(*args, **kwargs):
    return get(*args, **kwargs, verify=False)


@api_view(['POST'])
@permission_classes([])
@throttle_classes([HighLoadThrottle])
def login(request) -> Response:
    api_response = post_request(settings.MS_URLS['AUTH']['LOGIN'], json=request.data)
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    data = api_response.json()
    if 'token' in data:
        return Response(data=data, status=200)
    response = Response(status=200)
    response.set_cookie(
        key='refresh_token',
        value=data.pop('refresh_token'),
        max_age=data.pop('exp'),
        secure=True,
        httponly=True,
        samesite='Lax',
    )
    response.data = data
    return response


@api_view(['POST'])
@throttle_classes([MediumLoadThrottle])
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
@throttle_classes([HighLoadThrottle])
def password_recovery(request) -> Response:
    api_response = post_request(settings.MS_URLS['AUTH']['PASSWORD_RECOVERY'], json=request.data)
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    kwargs = api_response.json()
    if 'type' in kwargs:
        return Response(data=kwargs, status=200)
    send_password_reset_email(**kwargs)
    return Response(status=200)


@api_view(['POST'])
@permission_classes([])
@throttle_classes([MediumLoadThrottle])
def password_reset(request) -> Response:
    body = request.data
    body.update({'token': request.query_params.get('token', '')})
    api_response = post_request(settings.MS_URLS['AUTH']['PASSWORD_RESET'], json=body)
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    return Response(status=200)


@api_view(['GET'])
@permission_classes([IsUser])
@throttle_classes([HighLoadThrottle])
def generate_ntf_ticket(request) -> Response:
    user = request.user
    # websocket_ticket = WebsocketTicket.objects.create(user.user_tokens)
    data = {"username": user.username}
    api_response = post_request(settings.MS_URLS['NTF_TICKET'], json=data)
    if api_response.status_code >= 300:
        return Response(api_response.json(), status=503)
    return Response(api_response.json(), status=200)


@api_view(['GET'])
@permission_classes([IsUser])
@throttle_classes([HighLoadThrottle])
def generate_chat_ticket(request) -> Response:
    user = request.user
    # websocket_ticket = WebsocketTicket.objects.create(user.user_tokens)
    data = {"username": user.username}
    api_response = post_request(settings.MS_URLS['CHAT_TICKET'], json=data)
    if api_response.status_code >= 300:
        return Response(api_response.json(), status=503)
    return Response(api_response.json(), status=200)


@api_view(['GET'])
@permission_classes([IsUser])
@throttle_classes([MediumLoadThrottle])
def get_queue_ticket(request) -> Response:
    username = request.user.username
    data = {'username': username}
    # logger.warning("#" * 50)
    api_response = post_request(settings.MS_URLS['MATCHMAKING_TOKEN'], json=data)
    # logger.warning("#" * 50)
    if api_response.status_code != 200:
        # logger.warning(f"status code: {api_response.status_code}")
        # logger.warning(f"json: {api_response.json()}")
        return Response(data={'message': f'api: {api_response.status_code}'}, status=503)
    # logger.warning(f"\n\n\n\n\nDJANGO API RESPONSE: {api_response.json()}")
    return Response(data=api_response.json(), status=200)


@api_view(['GET'])
@permission_classes([])
@throttle_classes([LowLoadThrottle])
def retrieve_pubkey(request) -> Response:
    api_response = get_request(settings.MS_URLS['AUTH']['RETRIEVE_PUBKEY'])
    if api_response.status_code != 200:
        return Response(data=api_response.text, status=api_response.status_code)
    return Response(data=api_response.json(), status=200)


@api_view(['GET'])
@permission_classes([])
@throttle_classes([HighLoadThrottle])
def email_token_validation(request) -> Response:
    token = request.query_params.get("token", "")
    if token == '':
        return Response(data={'message': 'missing token'}, status=400)
    api_response = post_request(
        settings.MS_URLS['AUTH']['VERIFY_EMAIL'],
        json={'token': token}
    )
    if api_response.status_code != 200:
        return Response(api_response.json(), status=api_response.status_code)
    return Response(status=200)


@api_view(['GET'])
@throttle_classes([EmailThrottle])
@get_func_credentials
def send_verification_email(request) -> Response:
    api_response = get_request(
        settings.MS_URLS['AUTH']['EMAIL_DETAILS'],
        headers=request.api_headers,
    )
    if api_response.status_code != 200:
        return Response(data=api_response.text, status=api_response.status_code)
    send_verification_email(**api_response.json())
    return Response(status=200)
