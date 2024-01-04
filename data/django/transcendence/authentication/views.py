
from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.response import Response

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import TokenPairSerializer
from .models import JwtToken

from accounts.models import User
from accounts.serializers import UserSerializer

from transcendence.settings import TZ

from datetime import datetime


class LogoutView(APIView):
    throttle_scope = 'auth'

    def post(self, request) -> Response:
        refresh_token = RefreshToken(request.COOKIES.get('refresh_token'))
        try:
            JwtToken.objects.create(refresh_token)
        except TokenError:
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
                refresh_token = TokenPairSerializer.get_token(user)
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
                response.headers["Access-Control-Allow-Credentials"] = "true"
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
