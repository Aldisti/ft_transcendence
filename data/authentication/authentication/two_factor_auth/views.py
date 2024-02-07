
from rest_framework.decorators import APIView, api_view, permission_classes, throttle_classes
from rest_framework.response import Response

from django.core.exceptions import ValidationError
from django.conf import settings

from two_factor_auth.models import UserTFA, OtpCode

from authentication.throttles import HighLoadThrottle, MediumLoadThrottle, LowLoadThrottle
from authorization.serializers import TokenPairSerializer

from datetime import datetime
import logging


logger = logging.getLogger(__name__)


class ManageView(APIView):
    throttle_classes = [LowLoadThrottle]

    def get(self, request) -> Response:
        user_tfa = request.user.user_tfa
        return Response(data=user_tfa.to_data(), status=200)

    def post(self, request) -> Response:
        tfa_type = request.data.get('type', '')
        user_tfa = request.user.user_tfa
        try:
            user_tfa = UserTFA.objects.activate(user_tfa, otp_type=tfa_type)
        except ValidationError as e:
            return Response(data={'message': e.message}, status=400)
        if user_tfa.is_email():
            return Response(status=200)
        return Response({
            'uri': user_tfa.get_uri(),
            'token': user_tfa.otp_token
        }, status=200)

    def put(self, request) -> Response:
        user_tfa = request.user.user_tfa
        if not user_tfa.active:
            return Response(data={'message': '2fa not active'}, status=400)
        code = request.data.get('code', '')
        if code == '':
            return Response(data={'message': 'code is missing'}, status=400)
        if user_tfa.verify_otp_code(code):
            user_tfa = UserTFA.objects.deactivate(user_tfa)
            OtpCode.objects.delete_codes(user_tfa)
            return Response(status=200)
        return Response(data={'message': 'invalid code'}, status=400)


@api_view(['POST'])
@permission_classes([])
@throttle_classes([HighLoadThrottle])
def validate_login(request) -> Response:
    url_token = request.query_params.get('token', '')
    code = request.data.get('code', '')
    if url_token == '' or code == '':
        return Response(data={'message': 'missing token or code'}, status=400)
    try:
        user_tfa = UserTFA.objects.get(url_token=url_token)
    except UserTFA.DoesNotExist:
        return Response(data={'message': 'user not found'}, status=404)
    # TODO: check if user is trying to reset the password, idk why
    # if user_tfa.user.user_tokens.is_resetting_password():
    #     return Response(status=403)
    if not user_tfa.verify_otp_code(code):
        if not OtpCode.objects.validate_code(user_tfa, code):
            user_tfa = UserTFA.objects.generate_url_token(user_tfa)
            return Response(data={
                'message': 'invalid code',
                'token': user_tfa.url_token
            }, status=400)
        OtpCode.objects.delete_codes(user_tfa)
        user_tfa = UserTFA.objects.deactivate(user_tfa)
    user_tfa = UserTFA.objects.delete_url_token(user_tfa)
    refresh_token = TokenPairSerializer.get_token(user_tfa.user)
    exp = datetime.fromtimestamp(refresh_token['exp'], tz=settings.TZ) - datetime.now(tz=settings.TZ)
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
    url_token = request.query_params.get('token', '')
    code = request.data.get('code', '')
    if url_token == '' or code == '':
        return Response(data={'message': 'missing token or code'}, status=400)
    try:
        user_tfa = UserTFA.objects.get(url_token=url_token)
    except UserTFA.DoesNotExist:
        return Response(data={'message': 'user not found'}, status=404)
    # TODO: check if user is resetting the password, again, idk why
    # if not user_tfa.user.user_tokens.is_resetting_password():
    #     return Response(status=403)
    if not user_tfa.verify_otp_code(code):
        if not OtpCode.objects.validate_code(user_tfa, code):
            user_tfa = UserTFA.objects.generate_url_token(user_tfa)
            return Response(data={
                'message': 'invalid code',
                'token': user_tfa.url_token}, status=400)
    user_tfa = UserTFA.objects.delete_url_token(user_tfa)
    # TODO: return the token to reset the password
    # return Response(data={'token': user_tfa.user.user_tokens.password_token}, status=200)
    return Response(status=200)


@api_view(['POST'])
@throttle_classes([MediumLoadThrottle])
def validate_activate(request) -> Response:
    code = request.data.get('code', '')
    if code == '':
        return Response(data={'message': 'missing code'}, status=400)
    user_tfa = request.user.user_tfa
    if not user_tfa.is_activating():
        return Response(data={
            'message': "2fa activation process not started yet",
        }, status=403)
    if not user_tfa.verify_otp_code(code):
        UserTFA.objects.delete_url_token(user_tfa)
        return Response(data={'message': 'invalid code'}, status=400)
    user_tfa = UserTFA.objects.delete_url_token(user_tfa)
    otp_codes = OtpCode.objects.generate_codes(user_tfa=user_tfa)
    codes = [otp_code.code for otp_code in otp_codes]
    UserTFA.objects.activate(user_tfa)
    return Response(data={'codes': codes}, status=200)
