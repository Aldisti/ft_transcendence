from urllib.parse import unquote

from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import APIView, api_view, permission_classes, throttle_classes
from rest_framework.response import Response

from accounts.models import User
from oauth2.settings import *
from oauth2.models import UserOpenId

from authentication.serializers import TokenPairSerializer as Tokens
from authentication.throttles import HighLoadThrottle, MediumLoadThrottle, LowLoadThrottle

from transcendence.settings import TZ

from secrets import token_urlsafe
from datetime import datetime
from jwt import decode
import requests
import logging


logger = logging.getLogger(__name__)


@api_view(['GET'])
@throttle_classes([LowLoadThrottle])
def is_user_linked(request) -> Response:
    user: User = request.user
    data = {'intra': False, 'google': False}
    if user.linked:
        data['intra'] = user.user_openid.is_intra_linked()
        data['google'] = user.user_openid.is_google_linked()
    return Response(data=data, status=200)


class IntraCallback(APIView):
    permission_classes = []
    throttle_scope = 'medium_load'

    def get(self, request, req_type: str) -> Response:
        request_body = INTRA_REQUEST_BODY.copy()
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
            location_url = CLIENT_REDIRECT_LOGIN
        elif req_type == 'link':
            location_url = CLIENT_REDIRECT_LINK
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


@api_view(['GET'])
@permission_classes([])
@throttle_classes([LowLoadThrottle])
def get_intra_url(self, request) -> Response:
    req_type = request.query_params.get('type')
    if req_type not in ['login', 'link']:
        return Response(data={'message': 'invalid type'}, status=400)
    state = token_urlsafe()
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
    throttle_scope = 'medium_load'

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
        if not user.linked or not user.user_openid.is_intra_linked():
            return Response(data={'message': 'account not linked'}, status=400)
        try:
            UserOpenId.objects.unlink_intra(user.user_openid)
        except ValidationError as e:
            return Response(data={'message': str(e)}, status=400)
        return Response(status=200)


@api_view(['POST'])
@permission_classes([])
@throttle_classes([HighLoadThrottle])
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


@api_view(['GET'])
@permission_classes([])
@throttle_classes([LowLoadThrottle])
def get_google_url(request) -> Response:
    req_type = request.query_params.get('type')
    if req_type == 'login':
        redirect_uri = GOOGLE_LOGIN_REDIRECT_URI
    elif req_type == 'link':
        redirect_uri = GOOGLE_LINK_REDIRECT_URI
    else:
        return Response(data={'message': 'invalid type'}, status=400)
    state = token_urlsafe()
    url = (
        f"{GOOGLE_AUTH}?"
        f"client_id={quote(GOOGLE_CLIENT_ID)}&"
        f"response_type={quote(RESPONSE_TYPE)}&"
        f"scope={quote(GOOGLE_SCOPE)}&"
        f"redirect_uri={quote(redirect_uri)}"
        # f"state={quote(state)}"
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


@api_view(['GET'])
@throttle_classes([MediumLoadThrottle])
def google_link_callback(request) -> Response:
    request_body = GOOGLE_REQUEST_BODY.copy()
    request_body['code'] = request.GET.get('code')
    request_body['redirect_uri'] = GOOGLE_LINK_REDIRECT_URI
    # request_body['state'] = request.GET.get('state')
    api_response = requests.post(GOOGLE_TOKEN, json=request_body)
    if api_response.status_code != 200:
        return Response(data={
            'status': api_response.status_code,
            'error': f"{api_response.json()}"
        }, status=503)
    payload = decode(api_response.json()['id_token'], options={"verify_signature": False})
    user = User.objects.get(pk='aldisti')
    if not user.linked:
        UserOpenId.objects.create(user=user, google_email=payload['email'])
        User.objects.update_user_linked(user, True)
    elif user.user_openid.is_google_linked():
        return Response(data={'message': 'user already linked'}, status=400)
    else:
        UserOpenId.objects.link_google(user.user_openid, google_email=payload['email'])
    response = Response(
        status=status.HTTP_307_TEMPORARY_REDIRECT,
        headers={'Location': CLIENT_REDIRECT_LINK}
    )
    response.set_cookie('state_token', 'deleted', max_age=0)
    return response


@api_view(['GET'])
@permission_classes([])
@throttle_classes([MediumLoadThrottle])
def google_login_callback(request) -> Response:
    request_body = GOOGLE_REQUEST_BODY.copy()
    request_body['code'] = request.GET.get('code')
    request_body['redirect_uri'] = GOOGLE_LOGIN_REDIRECT_URI
    # request_body['state'] = request.GET.get('state')
    api_response = requests.post(GOOGLE_TOKEN, json=request_body)
    if api_response.status_code != 200:
        return Response(data={
            'status': api_response.status_code,
            'error': f"{api_response.json()}"
        }, status=503)
    payload = decode(api_response.json()['id_token'], options={"verify_signature": False})
    try:
        user_openid = UserOpenId.objects.get(google_email=payload['email'])
    except UserOpenId.DoesNotExist:
        return Response(data={'message': 'user not found'}, status=404)
    refresh_token = Tokens.get_token(user_openid.user)
    exp = datetime.fromtimestamp(refresh_token['exp'], tz=TZ) - datetime.now(tz=TZ)
    response = Response(
        data={'access_token': str(refresh_token.access_token)},
        status=status.HTTP_307_TEMPORARY_REDIRECT,
        headers={'Location': CLIENT_REDIRECT_LOGIN}
    )
    response.set_cookie('state_token', 'deleted', max_age=0)
    response.set_cookie(
        key='refresh_token',
        value=str(refresh_token),
        max_age=exp,
        secure=False,
        httponly=False,
        samesite=None,
    )
    return response


@api_view(['DELETE'])
@throttle_classes([LowLoadThrottle])
def unlink_google(request) -> Response:
    user: User = request.user
    if not user.linked or not user.user_openid.is_google_linked():
        return Response(data={'message': 'user not linked'}, status=400)
    UserOpenId.objects.unlink_google(user.user_openid)
    return Response(status=200)


# Another version of Google OAuth2


@api_view(['GET'])
@permission_classes([])
@throttle_classes([LowLoadThrottle])
def get_google_url_v2(request) -> Response:
    state = token_urlsafe()
    url = (
        f"{GOOGLE_AUTH}?"
        f"client_id={quote(GOOGLE_CLIENT_ID)}&"
        f"response_type={quote(RESPONSE_TYPE)}&"
        f"scope={quote(GOOGLE_SCOPE)}&"
        f"redirect_uri={quote('http://localhost:4200/google/callback')}&"
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


@api_view(['POST'])
@permission_classes([]) # should have the basic permission class
@throttle_classes([])
def google_link(request) -> Response:
    request_body = GOOGLE_REQUEST_BODY.copy()
    request_body['code'] = request.data.get('code')
    logger.warning(f"google_link: body state: {request.data.get('state')}")
    logger.warning(f"google_link: cookie state: {request.COOKIES.get('state_token')}")
    # request_body['state'] = request.data.get('state')
    request_body['redirect_uri'] = 'http://localhost:4200/google/callback'
    # if testing is needed just comment this three lines
    # and uncomment the try except down there
    user: User = request.user
    if user.linked and user.user_openid.is_google_linked():
        return Response(data={'message': 'user already linked'}, status=400)

    api_response = requests.post(GOOGLE_TOKEN, json=request_body)
    if api_response.status_code != 200:
        return Response(data={
            'status': api_response.status_code,
            'error': f"{api_response.json()}",
        }, status=503)
    payload = decode(api_response.json()['id_token'], options={"verify_signature": False})

    # this try except is temporary and should be deleted
    # its only purpose is TESTING
    # try:
    #     user = User.objects.get(pk='aldisti')
    # except User.DoesNotExist:
    #     user = User.objects.create_user('aldisti', 'alessandrodiste99@gmail.com', 'password')

    if user.linked:
        UserOpenId.objects.link_google(user.user_openid, google_email=payload['email'])
    else:
        UserOpenId.objects.create(user, google_email=payload['email'])
    return Response(status=200)


@api_view(['POST'])
@permission_classes([])
@throttle_classes([])
def google_login(request) -> Response:
    request_body = GOOGLE_REQUEST_BODY.copy()
    request_body['code'] = request.data.get('code')
    logger.warning(f"google_login: body state: {request.data.get('state')}")
    logger.warning(f"google_login: cookie state: {request.COOKIES.get('state_token')}")
    # request_body['state'] = request.data.get('state')
    request_body['redirect_uri'] = 'http://localhost:4200/google/callback'
    api_response = requests.post(GOOGLE_TOKEN, json=request_body)
    if api_response.status_code != 200:
        return Response(data={
            'status': api_response.status_code,
            'error': f"{api_response.json()}",
        }, status=503)
    payload = decode(api_response.json()['id_token'], options={"verify_signature": False})
    try:
        user_openid = UserOpenId.objects.get(google_email=payload['email'])
    except UserOpenId.DoesNotExist:
        return Response(data={'user not found'}, status=404)
    refresh_token = Tokens.get_token(user_openid.user)
    exp = datetime.fromtimestamp(refresh_token['exp'], tz=TZ) - datetime.now(tz=TZ)
    response = Response(data={
        'access_token': str(refresh_token.access_token),
    }, status=200)
    response.set_cookie('state_token', 'deleted', max_age=0)
    response.set_cookie(
        key='refresh_token',
        value=str(refresh_token),
        max_age=exp,
        secure=False,
        httponly=False,
        samesite=None,
    )
    return response
