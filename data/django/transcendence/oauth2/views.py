
import logging

from django.conf import settings
from requests import delete
from requests import get
from requests import post
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response

from transcendence.decorators import get_func_credentials
from transcendence.throttles import LowLoadThrottle

logger = logging.getLogger(__name__)


def delete_request(*args, **kwargs):
    return delete(*args, **kwargs, verify=False)


def post_request(*args, **kwargs):
    return post(*args, **kwargs, verify=False)


def get_request(*args, **kwargs):
    return get(*args, **kwargs, verify=False)


@api_view(['GET'])
@throttle_classes([LowLoadThrottle])
@get_func_credentials
def is_user_linked(request) -> Response:
    api_response = get_request(
        settings.MS_URLS['AUTH']['OAUTH2_LINKED'],
        headers=request.api_headers,
        cookies=request.api_cookies,
    )
    return Response(data=api_response.json(), status=api_response.status_code)


@api_view(['GET'])
@permission_classes([])
@throttle_classes([LowLoadThrottle])
def intra_get_url(request) -> Response:
    api_response = get_request(
        settings.MS_URLS['AUTH']['INTRA_URL'],
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    data = api_response.json()
    state = data.pop('intra_state')
    response = Response(data=data, status=200)
    response.set_cookie(
        key='intra_state',
        value=state,
        max_age=7200,
        secure=True,
        httponly=True,
        samesite='Lax',
    )
    return response


@api_view(['POST'])
@permission_classes([])
@throttle_classes([LowLoadThrottle])
@get_func_credentials
def intra_login(request) -> Response:
    """
    cookies: 'intra_state=<intra_state>'
    json: {'code': <code>, 'state': <state>}
    """
    api_response = post_request(
        settings.MS_URLS['AUTH']['INTRA_LOGIN'],
        cookies=request.api_cookies,
        json=request.data,
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    data = api_response.json()
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
@throttle_classes([LowLoadThrottle])
@get_func_credentials
def intra_link(request) -> Response:
    """
    header: 'Authorization: Bearer <access_token>'
    cookies: 'intra_state=<intra_state>'
    json: {'code': <code>, 'state': <state>}
    """
    api_response = post_request(
        settings.MS_URLS['AUTH']['INTRA_LINK'],
        headers=request.api_headers,
        cookies=request.api_cookies,
        json=request.data,
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    return Response(status=200)


@api_view(['DELETE'])
@throttle_classes([LowLoadThrottle])
@get_func_credentials
def intra_unlink(request) -> Response:
    """
    header: 'Authorization: Bearer <access_token>'
    """
    api_response = delete_request(
        settings.MS_URLS['AUTH']['INTRA_UNLINK'],
        headers=request.api_headers,
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    return Response(status=200)


@api_view(['GET'])
@permission_classes([])
@throttle_classes([LowLoadThrottle])
@get_func_credentials
def get_google_url(request) -> Response:
    api_response = get_request(
        settings.MS_URLS['AUTH']['GOOGLE_URL'],
        headers=request.api_headers,
        cookies=request.api_cookies,
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    data = api_response.json()
    state = data.pop('state', '')
    response = Response(data=data, status=api_response.status_code)
    response.set_cookie(
        key='google_state',
        value=state,
        max_age=7200,
        secure=True,
        httponly=True,
        samesite='Lax',
    )
    return response


@api_view(['POST'])
@throttle_classes([LowLoadThrottle])
@get_func_credentials
def google_link(request) -> Response:
    api_response = post_request(
        settings.MS_URLS['AUTH']['GOOGLE_LINK'],
        headers=request.api_headers,
        cookies=request.api_cookies,
        json=request.data,
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    response = Response(status=200)
    response.set_cookie('google_state', 'deleted', max_age=0)
    return response


@api_view(['POST'])
@permission_classes([])
@throttle_classes([LowLoadThrottle])
@get_func_credentials
def google_login(request) -> Response:
    api_response = post_request(
        settings.MS_URLS['AUTH']['GOOGLE_LOGIN'],
        headers=request.api_headers,
        cookies=request.api_cookies,
        json=request.data,
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    data = api_response.json()
    response = Response(status=200)
    response.set_cookie('google_state', 'deleted', max_age=0)
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


@api_view(['DELETE'])
@throttle_classes([LowLoadThrottle])
@get_func_credentials
def unlink_google(request) -> Response:
    api_response = delete_request(
        settings.MS_URLS['AUTH']['GOOGLE_UNLINK'],
        headers=request.api_headers,
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    return Response(status=200)
