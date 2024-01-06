
from rest_framework import status
from rest_framework.decorators import APIView, api_view, permission_classes, throttle_classes
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from accounts.models import User
from two_factor_auth.models import UserTwoFactorAuth

from accounts.serializers import UserSerializer

from authentication.serializers import TokenPairSerializer

from transcendence.settings import TZ

from datetime import datetime
import pyotp


@api_view(['GET', 'POST'])
def activate_tfa(request) -> Response:
    try:
        user_tfa = UserTwoFactorAuth.objects.create(user=request.user)
    except ValidationError:
        return Response('2fa already activated', status=status.HTTP_409_CONFLICT)
    uri = (pyotp.totp.TOTP(user_tfa.otp_token)
           .provisioning_uri(name=user_tfa.user.email, issuer_name='Transcendence'))
    return Response({'uri': uri, 'code': user_tfa.otp_token}, status=200)


@api_view(['DELETE'])
def disable_tfa(request) -> Response:
    code = request.data.get('code', None)
    if code is None:
        return Response('code missing', status=status.HTTP_400_BAD_REQUEST)
    user_tfa = UserTwoFactorAuth.objects.get(user=request.user)
    if pyotp.TOTP(user_tfa.otp_token).verify(code, valid_window=1):
        user_tfa.delete()
        return Response('2fa disabled', status=status.HTTP_200_OK)
    return Response('invalid code', status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def validate_tfa(request) -> Response:
    url_token = request.query_params.get('url_token')
    code = request.data.get('code', None)
    if url_token is None or code is None:
        return Response('url_token or code missing', status=400)
    user_tfa = UserTwoFactorAuth.objects.get(pk=request.user)
    if url_token != user_tfa.url_token:
        return Response('invalid url_token or code', status=400)
    UserTwoFactorAuth.objects.delete_url_token(user_tfa)
    if not pyotp.TOTP(user_tfa.otp_token).verify(code, valid_window=1):
        return Response('invalid code', status=status.HTTP_400_BAD_REQUEST)
    refresh_token = TokenPairSerializer.get_token(request.user)
    exp = datetime.fromtimestamp(refresh_token['exp'], tz=TZ) - datetime.now(tz=TZ)
    response = Response({'access_token': str(refresh_token.access_token)}, status=200)
    response.set_cookie(
        key='refresh_token',
        value=str(refresh_token),
        max_age=exp,
        secure=False,
        httponly=False,
        samesite=None,
    )
    return response
    # code = request.data.get('code', None)
    # if code is None:
    #     return Response('code missing', status=status.HTTP_400_BAD_REQUEST)
    # user_tfa = UserTwoFactorAuth.objects.get(user=request.user)


@api_view(['POST'])
@permission_classes([])
def login(request) -> Response:
    serializer = UserSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.get(pk=serializer.validated_data['username'])
    if not user.check_password(serializer.validated_data['password']):
        return Response("invalid username or password", status=status.HTTP_400_BAD_REQUEST)
    # if user.user_tfa.type == 'EM':
    #     pass
    # elif user.user_tfa.type == 'SW':
    #     pass
    # else:
    #     return Response('invalid 2fa type', status=500)
    UserTwoFactorAuth.objects.generate_url_token(user.user_tfa)
    redirect_uri = 'http://localhost:8000/2fa/validate/?url_token=' + user.user_tfa.url_token
    refresh_token = TokenPairSerializer.get_token(user)
    return Response({
        'access_token': str(refresh_token.access_token),
        'redirect_uri': redirect_uri,
    }, status=200)
