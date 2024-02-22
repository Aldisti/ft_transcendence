import logging

from django.conf import settings
from requests import get as get_request
from requests import post as post_request
from requests import put as put_request
from rest_framework.decorators import APIView, api_view, permission_classes, throttle_classes
from rest_framework.response import Response

from email_manager.email_sender import send_tfa_code_email
from transcendence.decorators import get_func_credentials, get_class_credentials
from transcendence.throttles import HighLoadThrottle, MediumLoadThrottle, LowLoadThrottle, EmailThrottle

logger = logging.getLogger(__name__)


class ManageView(APIView):
    throttle_classes = [LowLoadThrottle]

    @get_class_credentials
    def get(self, request) -> Response:
        api_response = get_request(
            settings.MS_URLS['AUTH']['TFA_MANAGE'],
            headers=request.api_headers,
        )
        return Response(data=api_response.json(), status=api_response.status_code)

    @get_class_credentials
    def post(self, request) -> Response:
        api_response = post_request(
            settings.MS_URLS['AUTH']['TFA_MANAGE'],
            headers=request.api_headers,
            json=request.data,
        )
        if api_response.status_code == 204:
            return Response(status=200)
        return Response(data=api_response.json(), status=api_response.status_code)

    @get_class_credentials
    def put(self, request) -> Response:
        api_response = put_request(
            settings.MS_URLS['AUTH']['TFA_MANAGE'],
            headers=request.api_headers,
            json=request.data,
        )
        if api_response.status_code != 200:
            return Response(data=api_response.json(), status=api_response.status_code)
        return Response(status=200)


@api_view(['POST'])
@permission_classes([])
@throttle_classes([HighLoadThrottle])
@get_func_credentials
def validate_login(request) -> Response:
    data = request.data
    if 'token' not in data:
        data['token'] = request.query_params.get('token')
    api_response = post_request(
        settings.MS_URLS['AUTH']['TFA_LOGIN'],
        json=data,
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    data = api_response.json()
    response = Response(status=200)
    response.set_cookie(
        key='refresh_token',
        value=data.pop('refresh_token'),
        max_age=data.pop('exp'),
        secure=False,
        httponly=False,
        samesite=None,
    )
    response.data = data
    return response


@api_view(['POST'])
@permission_classes([])
@throttle_classes([HighLoadThrottle])
@get_func_credentials
def validate_recover(request) -> Response:
    data = request.data
    if 'token' not in data:
        data['token'] = request.query_params.get('token', '')
    api_response = post_request(
        settings.MS_URLS['AUTH']['TFA_RECOVER'],
        headers=request.api_headers,
        json=data,
    )
    return Response(data=api_response.json(), status=api_response.status_code)


@api_view(['POST'])
@throttle_classes([MediumLoadThrottle])
@get_func_credentials
def validate_activate(request) -> Response:
    data = request.data
    if 'token' not in data:
        data['token'] = request.query_params.get('token', '')
    api_response = post_request(
        settings.MS_URLS['AUTH']['TFA_ACTIVATE'],
        headers=request.api_headers,
        json=request.data,
    )
    return Response(data=api_response.json(), status=api_response.status_code)


@api_view(['GET'])
@permission_classes([])
@throttle_classes([EmailThrottle])
@get_func_credentials
def get_email_code(request) -> Response:
    data = request.data
    if 'token' not in data:
        data['token'] = request.query_params.get('token', '')
    if data.get('token', '') == '':
        return Response(data={'message': 'missing token'}, status=400)
    api_response = get_request(
        settings.MS_URLS['AUTH']['TFA_EMAIL'],
        headers=request.api_headers,
        json=data,
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    send_tfa_code_email(**api_response.json())
    return Response(200)
