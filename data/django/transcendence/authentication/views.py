from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.decorators import APIView, api_view, permission_classes
from rest_framework.response import Response

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from email_manager.models import UserTokens
from two_factor_auth.models import UserTFA
from .serializers import TokenPairSerializer
from .models import JwtToken

from accounts.models import User
from accounts.serializers import UserSerializer

from transcendence.settings import TZ

from datetime import datetime

import logging

logger = logging.getLogger()


class LogoutView(APIView):
    throttle_scope = 'auth'

    def get(self, request) -> Response:
        logger.warning(f"token: {request.COOKIES}")
        refresh_token = RefreshToken(request.COOKIES.get('refresh_token'))
        if refresh_token is None:
            return Response(data={'message': 'no token found'}, status=401)
        try:
            JwtToken.objects.create(refresh_token)
        except TokenError:
            return Response(data={'message': "invalid token"}, status=403)
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
        # if not user.verified:
        #     return Response(data={'message': 'user not verified yet'}, status=400)
        if not user.active:
            return Response(data={'message': "user isn't active"}, status=400)
        # TODO: gpanico should check this line
        UserTokens.objects.clear_password_token(user.user_tokens)

        if user.user_tfa.is_active():
            user_tfa = UserTFA.objects.generate_url_token(user.user_tfa)
            return Response(data={
                'token': user_tfa.url_token,
                'type': user_tfa.type,
            }, status=200)
        refresh_token = TokenPairSerializer.get_token(user)
        exp = datetime.fromtimestamp(refresh_token['exp'], tz=TZ) - datetime.now(tz=TZ)
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


class RefreshView(APIView):
    throttle_scope = 'auth'
    permission_classes = []

    def get(self, request) -> Response:
        error_response = Response(status=403)
        error_response.set_cookie('refresh_token', 'deleted', max_age=0)
        if request.auth is not None:
            return Response(data={
                'message': 'cannot refresh with valid access token'
            }, status=400)
        try:
            token = RefreshToken(request.COOKIES.get('refresh_token'))
            if token is None:
                raise TokenError()
            if JwtToken.objects.filter(token=token['csrf']).exists():
                raise TokenError()
            user = User.objects.get(pk=token['username'])
            if not user.active:
                error_response.data({'message': "user isn't active"})
                return error_response
            return Response({'access_token': str(token.access_token)}, status=200)
        except TokenError:
            error_response.data(data={'message': 'invalid refresh token'})
            return error_response


#@api_view(['GET', 'POST'])
#@permission_classes([])
#def test(request):
#    response = Response({"access_token": "prova"})
#    response.set_cookie(
#            "test_token",
#            "prova",
#            max_age=1000000,
#            secure=False,
#            httponly=False,
#            samesite=None,
#            )
#    return response


