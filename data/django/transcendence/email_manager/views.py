from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, APIView
from rest_framework.response import Response

from authentication.models import UserTokens
from email_manager.email_sender import send_password_email, send_tfa_code_email, send_password_reset_email

from accounts.models import User

from two_factor_auth.models import UserTFA

from smtplib import SMTPException
from requests import post as post_request
from logging import getLogger


logger = getLogger(__name__)


@api_view(['GET'])
@permission_classes([])
def email_token_validation(request):
    token = request.query_params.get("token", "")
    if token == '':
        return Response(data={'message': 'missing token'}, status=400)
    api_response = post_request(
        settings.MS_URLS['AUTH']['VERIFY_EMAIL'],
        json={'token': token}
    )
    if api_response.status_code != 200:
        return Response(api_response.json(), status=api_response.status_code)
    return Response(status=200)


@api_view(['POST'])
@permission_classes([])
def password_recovery(request):
    api_response = post_request(settings.MS_URLS['AUTH']['PASSWORD_RECOVERY'], json=request.data)
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    data = api_response.json()
    if 'url_token' in data:
        return Response(data=api_response.json(), status=api_response.status_code)
    send_password_reset_email(**data)
    return Response(status=200)


@api_view(['POST'])
@permission_classes([])
def password_reset(request):
    token = request.query_params.get("token", "")
    if token == '':
        return Response(data={'message': 'missing token'}, status=400)
    data = request.data
    data['token'] = token
    api_response = post_request(
        settings.MS_URLS['AUTH']['PASSWORD_RESET'],
        json=data,
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    return Response(status=200)


class SendOtpCodeView(APIView):
    throttle_scope = 'email'
    permission_classes = []

    # TODO: redo this
    def get(self, request) -> Response:
        if request.auth is not None:
            user_tfa = request.user.user_tfa
        else:
            url_token = request.query_params.get("token")
            try:
                user_tfa = UserTFA.objects.get(url_token=url_token)
            except UserTFA.DoesNotExist:
                return Response(data={'message': 'token not found'}, status=404)
        if not user_tfa.is_email():
            return Response(data={'message': '2fa not active'}, status=400)
        try:
            send_tfa_code_email(user_tfa)
        except SMTPException as e:
            return Response(data={'message': f"\n{str(e)}\n"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response(status=200)
