from urllib.parse import unquote

from django.core.exceptions import ValidationError, ObjectDoesNotExist
from rest_framework import status
from rest_framework.decorators import APIView, api_view, permission_classes, throttle_classes
from rest_framework.response import Response

from accounts.models import User
from oauth2.settings import *
from oauth2.models import UserOpenId

from authentication.serializers import TokenPairSerializer as Tokens
from authentication.throttles import AnonAuthThrottle, UserAuthThrottle, MediumLoadThrottle

from transcendence.settings import TZ

from random import SystemRandom
from datetime import datetime
from base64 import b64encode
import requests
import logging


logger = logging.getLogger(__name__)


class IntraCallback(APIView):
    permission_classes = []
    throttle_scope = 'medium_load'

    def get(self, request, req_type: str) -> Response:
        # req_type = request.query_params.get('type')
        request_body = USER_INFO_DATA.copy()
        request_body['code'] = request.GET.get('code')
        request_body['state'] = request.GET.get('state')
        request_body['redirect_uri'] = INTRA_REDIRECT_URI + req_type + '/'
        logger.warning(f"cookie state: {request.COOKIES.get('state_token', '')}\n"
                       f"body state: {unquote(request_body['state'])}")
        # TODO: find a solution to check the state against csrf
        # if unquote(request_body['state']) != request.COOKIES.get('state_token'):
        #     return Response('invalid state, csrf suspected', status=status.HTTP_403_FORBIDDEN)
        api_response = requests.post(INTRA_TOKEN, json=request_body)
        if api_response.status_code != 200:
            return Response(data={
                'status': api_response.status_code,
                'error': f"{api_response.json()}"
            }, status=500)
        if req_type == 'login':
            location_url = CLIENT_INTRA_REDIRECT_LOGIN
        elif req_type == 'link':
            location_url = CLIENT_INTRA_REDIRECT_LINK
        else:
            return Response(data={'message': 'invalid type'}, status=400)
        response = Response(
            status=status.HTTP_307_TEMPORARY_REDIRECT,
            headers={'Location': location_url}
        )
        response.set_cookie('state_token', 'deleted', max_age=0)
        response.set_cookie(
            key='api_token',
            value=api_response.json()['access_token'],
            max_age=api_response.json()['expires_in'],
            secure=False,
            httponly=False,
            samesite=None,
        )
        return response


class IntraUrl(APIView):
    permission_classes = []
    throttle_scope = 'low_load'

    def get(self, request) -> Response:
        req_type = request.query_params.get('type')
        if req_type not in ['login', 'link']:
            return Response(data={'message': 'invalid type'}, status=400)
        state = b64encode(SystemRandom().randbytes(64)).decode('utf-8')
        url = (
            f"{INTRA_AUTH}?"
            f"client_id={INTRA_CLIENT_ID}&"
            f"redirect_uri={quote(INTRA_REDIRECT_URI + req_type + '/')}&"
            f"response_type={RESPONSE_TYPE}&"
            f"state={quote(state)}"
        )
        response = Response(data={'url': url}, status=200)
        response.set_cookie(
            key='state_token',
            value=state,
            max_age=7200,
            secure=False,
            httponly=False,
            samesite=None,
        )
        return response


class IntraLink(APIView):
    throttle_classes = [MediumLoadThrottle]

    def post(self, request) -> Response:
        if request.user.linked:
            user_openid = request.user.user_openid
        else:
            user_openid = UserOpenId.objects.create(user=request.user)
            User.objects.update_user_linked(request.user, True)
        if user_openid.is_intra_linked():
            return Response(data={'message': 'user already linked'}, status=400)
        headers = {'Authorization': f"Bearer {request.COOKIES['api_token']}"}
        api_response = requests.get(INTRA_USER_INFO, headers=headers)
        if api_response.status_code != 200:
            return Response(data={
                'message': f"api error: {api_response.status_code}"
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        name, email = api_response.json()['login'], api_response.json()['email']
        del api_response
        try:
            UserOpenId.objects.link_intra(user_openid, intra_name=name, intra_email=email)
        except ValidationError as e:
            return Response(data={'message': str(e)}, status=400)
        return Response(status=200)

    def delete(self, request) -> Response:
        user = request.user
        if not user.linked or not user.user_openid.is_linked_intra():
            return Response(data={'message': 'account not linked'}, status=400)
        try:
            UserOpenId.objects.unlink_intra(user.user_openid)
        except ValidationError as e:
            return Response(data={'message': str(e)}, status=400)
        return Response(status=200)


@api_view(['POST'])
@permission_classes([])
@throttle_classes([AnonAuthThrottle])
def intra_login(request) -> Response:
    headers = {'Authorization': f"Bearer {request.COOKIES['api_token']}"}
    api_response = requests.get(INTRA_USER_INFO, headers=headers)
    if api_response.status_code != 200:
        return Response(data={
            'message': f"api error: {api_response.status_code}"
        }, status=500)
    name, email = api_response.json()['login'], api_response.json()['email']
    del api_response
    try:
        user_openid = UserOpenId.objects.get(intra_name=name, intra_email=email)
    except UserOpenId.DoesNotExist:
        return Response(data={'message': 'user not linked'}, status=404)

    refresh_token = Tokens.get_token(user_openid.user)
    exp = datetime.fromtimestamp(refresh_token['exp'], tz=TZ) - datetime.now(tz=TZ)
    response = Response(data={
        'username': user_openid.user.username,
        'access_token': f"Bearer {str(refresh_token.access_token)}"
    }, status=200)
    response.set_cookie('api_token', 'deleted', max_age=0)
    response.set_cookie(
        key='refresh_token',
        value=str(refresh_token),
        max_age=exp,
        secure=False,
        httponly=False,
        samesite=None,
    )
    return response
