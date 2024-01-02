
from rest_framework import status
from rest_framework.decorators import APIView, api_view, permission_classes
from rest_framework.response import Response

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import MyTokenObtainPairSerializer
from .utils import shrink_dict
from .models import JwtToken

from .oauth2.info import *
from .oauth2 import requests as rq

from accounts.models import User
from accounts.serializers import UserSerializer, CompleteUserSerializer

from transcendence.settings import TZ

from datetime import datetime
from random import SystemRandom
from base64 import b64encode


@api_view(['GET'])
@permission_classes([])
def callback(request):
    params = USER_INFO_DATA.copy()
    params['code'] = request.GET.get('code')
    params['state'] = request.GET.get('state')
    try:
        data = rq.request('POST', API_TOKEN, body=params)
        hs = {'Authorization': f"Bearer {data.get('access_token')}"}
        data = rq.request('GET', API_USER_INFO, headers=hs)
    except rq.APIException as e:
        return Response(e.message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    data['username'] = data.pop('login')
    data = shrink_dict(data, API_USER_DATA)
    if User.objects.filter(username=data['username']).exists():
        user = User.objects.get(pk=data['username'])
        refresh_token = MyTokenObtainPairSerializer.get_token(user)
        exp = datetime.fromtimestamp(refresh_token['exp'], tz=TZ) - datetime.now(tz=TZ)
        response = Response({'access_token': str(refresh_token.access_token)}, status=200)
        response.set_cookie(
            key='refresh_token',
            value=str(refresh_token),
            max_age=exp.seconds,
            secure=False,
            httponly=False,
            samesite=None,
        )
        return response
        # return Response(user.data, status=200)
    return Response(data, status=200)


@api_view(['GET'])
@permission_classes([])
def get_url(request):
    state = b64encode(SystemRandom().randbytes(64)).decode('utf-8')
    url = (f"{API_AUTH}?"
           f"client_id={CLIENT_ID}&"
           f"redirect_uri={quote(REDIRECT_URI)}&"
           f"response_type={RESPONSE_TYPE}&"
           f"state={quote(state)}")
    return Response({'url': url}, status=200)


class LogoutView(APIView):
    throttle_scope = 'auth'

    def post(self, request) -> Response:
        refresh_token = RefreshToken(request.COOKIES.get('refresh_token'))
        try:
            JwtToken.objects.create(refresh_token)
        except ValueError or TokenError:
            return Response("Invalid token", status=status.HTTP_400_BAD_REQUEST)
        response = Response(status=200)
        response.set_cookie(
            key="refresh_token",
            value="removed",
            max_age=0,
        )
        return response


class LoginView(APIView):
    throttle_scope = 'auth'
    permission_classes = []

    def post(self, request) -> Response:
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = User.objects.get(pk=user_serializer.validated_data['username'])
            if user.check_password(user_serializer.validated_data['password']):
                if not user.active:
                    return Response("user isn't active", status=status.HTTP_400_BAD_REQUEST)
                refresh_token = MyTokenObtainPairSerializer.get_token(user)
                exp = datetime.fromtimestamp(refresh_token['exp'], tz=TZ) - datetime.now(tz=TZ)
                response = Response({'access_token': str(refresh_token.access_token)}, status=200)
                response.set_cookie(
                    key='refresh_token',
                    value=str(refresh_token),
                    max_age=exp.seconds,
                    secure=False,
                    httponly=False,
                    samesite=None,
                )
                return response
        return Response("invalid username or password", status=status.HTTP_400_BAD_REQUEST)


class RefreshView(APIView):
    throttle_scope = 'auth'
    permission_classes = []

    def post(self, request) -> Response:
        if request.auth is not None:
            return Response(
                'cannot refresh with valid access_token',
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            token = RefreshToken(request.COOKIES.get('refresh_token'))
            if JwtToken.objects.filter(token=token['csrf']).exists():
                raise TokenError()
            if User.objects.get(pk=token['username']).active is False:
                return Response("user isn't active", status=status.HTTP_400_BAD_REQUEST)
            return Response({'access_token': str(token.access_token)}, status=200)
        except TokenError:
            response = Response(
                'invalid refresh token',
                status=status.HTTP_400_BAD_REQUEST
            )
            response.set_cookie('refresh_token', "deleted", max_age=0)
            return response


# @api_view(['GET', 'POST'])
# @permission_classes([])
# def test(request):
#     data = {
#         'username': 'aldisti',
#         'first_name': 'Alessandro',
#         'last_name': 'Di Stefano',
#         'email': 'aldisti@student.42roma.it',
#         'password': 'password',
#         'id': 131904,
#         'pool_year': 2022,
#     }
#     serializer = CompleteUserSerializer(data=data)
#     if serializer.is_valid():
#         user = serializer.create(serializer.validated_data)
#         user.save()
#     else:
#         return Response("invalid data", status=status.HTTP_400_BAD_REQUEST)
#     return Response(f'user created {user.username}', status=200)
