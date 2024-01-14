from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.decorators import APIView, api_view, permission_classes, throttle_classes
from rest_framework.response import Response

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from authentication.throttles import LowLoadThrottle, MediumLoadThrottle
from email_manager.models import UserTokens

from two_factor_auth.models import UserTFA

from authentication.serializers import TokenPairSerializer
from authentication.models import JwtToken

from accounts.models import User
from accounts.serializers import UserSerializer

from transcendence.settings import TZ

from datetime import datetime

import logging


logger = logging.getLogger(__name__)


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
        # TODO: @gpanico should check this line
        UserTokens.objects.clear_password_token(user.user_tokens)
        if user.user_tfa.is_active():
            user_tfa = UserTFA.objects.generate_url_token(user.user_tfa)
            return Response(data={
                'token': user_tfa.url_token,
                'type': user_tfa.type,
            }, status=200)
        user = User.objects.update_last_login(user)
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
            httponly=False,
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


# @api_view(['GET', 'POST'])
# @permission_classes([])
# def test(request) -> Response:
#     data = {
#         'headers': request.headers,
#         'cookies': request.COOKIES,
#         'body': request.body,
#         'path': request.path,
#         'path_info': request.path_info,
#         'path_split': request.path.strip('/').split('/'),
#     }
#     if request.path.strip('/').split('/')[-1] == 'v2':
#         return Response(status=200)
#     return Response(data=data, status=200)


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
        token_exp = datetime.fromtimestamp(refresh_token['exp'], tz=TZ)
        if user.last_logout > user.last_login and user.last_logout > token_exp:
            return error_response
        return Response({'access_token': str(refresh_token.access_token)}, status=200)
