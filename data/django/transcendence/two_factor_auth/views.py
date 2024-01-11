
from rest_framework.decorators import APIView, api_view, permission_classes, throttle_classes
from rest_framework.response import Response

from django.core.exceptions import ValidationError

from email_manager.models import UserTokens
from two_factor_auth.models import UserTFA, OtpCode

from authentication.throttles import HighLoadThrottle, MediumLoadThrottle, LowLoadThrottle

from authentication.serializers import TokenPairSerializer

from transcendence.settings import TZ

from datetime import datetime
import pyotp
import logging


logger = logging.getLogger(__name__)


def verify_otp_code(user_tfa: UserTFA, code: str) -> bool:
    if user_tfa.is_email():
        totp = pyotp.TOTP(user_tfa.otp_token, interval=180)
    elif user_tfa.is_software():
        totp = pyotp.TOTP(user_tfa.otp_token)
    else:
        return False
    return totp.verify(code, for_time=datetime.now(tz=TZ), valid_window=1)


class ManageView(APIView):
    throttle_classes = [LowLoadThrottle]

    def get(self, request) -> Response:
        user_tfa = request.user.user_tfa
        data = {
            'username': user_tfa.user.username,
            'is_active': user_tfa.is_active(),
        }
        if not data['is_active']:
            return Response(data=data, status=200)
        data['type'] = user_tfa.type
        return Response(data=data, status=200)

    def post(self, request) -> Response:
        tfa_type = request.data.get('type', '').lower()
        user_tfa = request.user.user_tfa
        try:
            user_tfa = UserTFA.objects.activating(user_tfa, tfa_type=tfa_type)
        except ValidationError as e:
            return Response(data={'message': e.message}, status=400)
        if user_tfa.is_email():
            return Response(data={'message': 'request email'}, status=200)
        uri = (pyotp.totp.TOTP(user_tfa.otp_token)
               .provisioning_uri(name=user_tfa.user.email, issuer_name='Transcendence'))
        return Response({'uri': uri, 'token': user_tfa.otp_token}, status=200)

    def delete(self, request) -> Response:
        user_tfa = request.user.user_tfa
        if user_tfa.is_inactive():
            return Response(data={'message': '2fa not active'}, status=400)
        code = request.data.get('code', None)
        if code is None:
            return Response(data={'message': 'code is missing'}, status=400)
        if verify_otp_code(user_tfa, code):
            user_tfa = UserTFA.objects.deactivate(user_tfa)
            OtpCode.objects.delete_codes(user_tfa)
            return Response(status=200)
        return Response(data={'message': 'invalid code'}, status=400)


@api_view(['POST'])
@permission_classes([])
@throttle_classes([HighLoadThrottle])
def validate_login(request) -> Response:
    url_token = request.query_params.get('token', None)
    code = request.data.get('code', None)
    if url_token is None or code is None:
        return Response(data={'message': 'missing token or code'}, status=400)
    user_tfa = UserTFA.objects.get(url_token=url_token)
    if not verify_otp_code(user_tfa, code):
        user_tfa = UserTFA.objects.generate_url_token(user_tfa)
        return Response(data={
            'message': 'invalid code',
            'token': user_tfa.url_token}, status=400)
    user_tfa = UserTFA.objects.delete_url_token(user_tfa)

    refresh_token = TokenPairSerializer.get_token(user_tfa.user)
    exp = datetime.fromtimestamp(refresh_token['exp'], tz=TZ) - datetime.now(tz=TZ)
    response = Response(data={'access_token': str(refresh_token.access_token)}, status=200)
    response.set_cookie(
        key='refresh_token',
        value=str(refresh_token),
        max_age=exp,
        secure=False,
        httponly=False,
        samesite=None,
    )
    return response


@api_view(['POST'])
@permission_classes([])
@throttle_classes([HighLoadThrottle])
def validate_recover(request) -> Response:
    url_token = request.query_params.get('token', None)
    code = request.data.get('code', None)
    if url_token is None or code is None:
        return Response(data={'message': 'missing token or code'}, status=400)
    user_tfa = UserTFA.objects.get(url_token=url_token)
    if not verify_otp_code(user_tfa, code):
        user_tfa = UserTFA.objects.generate_url_token(user_tfa)
        return Response(data={
            'message': 'invalid code',
            'token': user_tfa.url_token}, status=400)
    user_tfa = UserTFA.objects.delete_url_token(user_tfa)
    user_tokens = UserTokens.objects.generate_password_token(user_tfa.user.user_tokens)
    return Response(data={'token': user_tokens.password_token}, status=200)


@api_view(['POST'])
@throttle_classes([MediumLoadThrottle])
def validate_activate(request) -> Response:
    code = request.data.get('code', None)
    if code is None:
        return Response(data={'message': 'missing code'}, status=400)
    logger.warning(f"code: {code}")
    user_tfa = request.user.user_tfa
    if not user_tfa.is_activating():
        return Response(data={
            'message': "2fa activation process not started yet",
        }, status=403)
    logger.warning(f"type: {user_tfa.type}")
    if not verify_otp_code(user_tfa, code):
        UserTFA.objects.delete_url_token(user_tfa)
        return Response(data={'message': 'invalid code'}, status=400)
    user_tfa = UserTFA.objects.delete_url_token(user_tfa)
    UserTFA.objects.activate(user_tfa)
    otp_codes = OtpCode.objects.create(user_tfa=user_tfa)
    codes = [otp_code.code for otp_code in otp_codes]
    return Response(data={'codes': codes}, status=200)
