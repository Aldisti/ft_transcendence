
from rest_framework.decorators import APIView, api_view, permission_classes, throttle_classes
from rest_framework.response import Response

from django.core.exceptions import ValidationError
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

from authentication.models import UserTokens
from transcendence.decorators import get_credentials
from two_factor_auth.models import UserTFA, OtpCode

from authentication.throttles import HighLoadThrottle, MediumLoadThrottle, LowLoadThrottle
from authentication.serializers import TokenPairSerializer

from requests import post as post_request
from requests import get as get_request
from requests import put as put_request
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
    # TODO: timezone thing
    return totp.verify(code, for_time=datetime.now(tz=settings.TZ), valid_window=1)


class ManageView(APIView):
    throttle_classes = [LowLoadThrottle]

    @get_credentials
    def get(self, request) -> Response:
        # user_tfa = request.user.user_tfa
        # data = {'is_active': user_tfa.is_active()}
        # if data['is_active']:
        #     data['type'] = user_tfa.type
        # return Response(data=data, status=200)
        api_response = get_request(
            settings.MS_URLS['AUTH']['TFA_MANAGE'],
            headers=request.api_headers,
        )
        return Response(data=api_response.json(), status=api_response.status_code)

    @get_credentials
    def post(self, request) -> Response:
        # tfa_type = request.data.get('type', '').lower()
        # user_tfa = request.user.user_tfa
        # try:
        #     user_tfa = UserTFA.objects.activating(user_tfa, tfa_type=tfa_type)
        # except ValidationError as e:
        #     return Response(data={'message': e.message}, status=400)
        # if user_tfa.is_email():
        #     return Response(status=200)
        # uri = (pyotp.totp.TOTP(user_tfa.otp_token)
        #        .provisioning_uri(name=user_tfa.user.email, issuer_name='Transcendence'))
        # return Response({'uri': uri, 'token': user_tfa.otp_token}, status=200)
        api_response = post_request(
            settings.MS_URLS['AUTH']['TFA_MANAGE'],
            headers=request.api_headers,
            json=request.data,
        )
        if api_response.status_code != 200:
            return Response(data=api_response.json(), status=200)
        elif api_response.status_code == 204:
            return Response(status=200)
        return Response(data=api_response.json(), status=api_response.status_code)

    def put(self, request) -> Response:
        # user_tfa = request.user.user_tfa
        # if user_tfa.is_inactive():
        #     return Response(data={'message': '2fa not active'}, status=400)
        # code = request.data.get('code', None)
        # if code is None:
        #     return Response(data={'message': 'code is missing'}, status=400)
        # if verify_otp_code(user_tfa, code):
        #     user_tfa = UserTFA.objects.deactivate(user_tfa)
        #     OtpCode.objects.delete_codes(user_tfa)
        #     return Response(status=200)
        # return Response(data={'message': 'invalid code'}, status=400)
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
def validate_login(request) -> Response:
    # url_token = request.query_params.get('token', None)
    # code = request.data.get('code', None)
    # if url_token is None or code is None:
    #     return Response(data={'message': 'missing token or code'}, status=400)
    # user_tfa = UserTFA.objects.get(url_token=url_token)
    # if user_tfa.user.user_tokens.is_resetting_password():
    #     return Response(status=403)
    # if not verify_otp_code(user_tfa, code):
    #     try:
    #         otp_code = user_tfa.otpcode_set.get(code=code)
    #     except OtpCode.DoesNotExist:
    #         user_tfa = UserTFA.objects.generate_url_token(user_tfa)
    #         return Response(data={
    #             'message': 'invalid code',
    #             'token': user_tfa.url_token
    #         }, status=400)
    #     else:
    #         OtpCode.objects.delete_codes(user_tfa)
    #         user_tfa = UserTFA.objects.deactivate(user_tfa)
    # user_tfa = UserTFA.objects.delete_url_token(user_tfa)
    #
    # refresh_token = TokenPairSerializer.get_token(user_tfa.user)
    # # TODO: timezone thing
    # exp = datetime.fromtimestamp(refresh_token['exp'], tz=settings.TZ) - datetime.now(tz=settings.TZ)
    # response = Response(data={'access_token': str(refresh_token.access_token)}, status=200)
    # response.set_cookie(
    #     key='refresh_token',
    #     value=str(refresh_token),
    #     max_age=exp,
    #     secure=False,
    #     httponly=False,
    #     samesite=None,
    # )
    # return response
    api_response = post_request(
        settings.MS_URLS['AUTH']['TFA_LOGIN'],
        json=request.data,
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    data = api_response.json()
    refresh_token = RefreshToken(data.pop('refresh_token'))
    exp = datetime.fromtimestamp(refresh_token['exp'], tz=settings.TZ) - datetime.now(tz=settings.TZ)
    response = Response(data=data, status=200)
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
    # url_token = request.query_params.get('token', None)
    # code = request.data.get('code', None)
    # if url_token is None or code is None:
    #     return Response(data={'message': 'missing token or code'}, status=400)
    # user_tfa = UserTFA.objects.get(url_token=url_token)
    # if not user_tfa.user.user_tokens.is_resetting_password():
    #     return Response(status=403)
    # if not verify_otp_code(user_tfa, code):
    #     user_tfa = UserTFA.objects.generate_url_token(user_tfa)
    #     return Response(data={
    #         'message': 'invalid code',
    #         'token': user_tfa.url_token}, status=400)
    # user_tfa = UserTFA.objects.delete_url_token(user_tfa)
    # return Response(data={'token': user_tfa.user.user_tokens.password_token}, status=200)
    url_token = request.query_params.get('token', '')
    data = request.data
    if 'token' not in data:
        data['token'] = request.query_params.get('token', '')
    api_response = post_request(
        settings.MS_URLS['AUTH']['TFA_RECOVER'],
        headers=request.api_headers,
        data=data,
    )
    return Response(data=api_response.json(), status=api_response.status_code)


@api_view(['POST'])
@throttle_classes([MediumLoadThrottle])
def validate_activate(request) -> Response:
    # code = request.data.get('code', None)
    # if code is None:
    #     return Response(data={'message': 'missing code'}, status=400)
    # user_tfa = request.user.user_tfa
    # if not user_tfa.is_activating():
    #     return Response(data={
    #         'message': "2fa activation process not started yet",
    #     }, status=403)
    # if not verify_otp_code(user_tfa, code):
    #     UserTFA.objects.delete_url_token(user_tfa)
    #     return Response(data={'message': 'invalid code'}, status=400)
    # user_tfa = UserTFA.objects.delete_url_token(user_tfa)
    # otp_codes = OtpCode.objects.generate_codes(user_tfa=user_tfa)
    # codes = [otp_code.code for otp_code in otp_codes]
    # UserTFA.objects.activate(user_tfa)
    # return Response(data={'codes': codes}, status=200)
    api_response = post_request(
        settings.MS_URLS['AUTH']['TFA_ACTIVATE'],
        headers=request.api_headers,
        data=request.data,
    )
    return Response(data=api_response.json(), status=api_response)
