from django.conf import settings

from rest_framework.decorators import api_view, permission_classes, APIView
from rest_framework.response import Response

from email_manager.email_sender import send_password_email, send_tfa_code_email, send_password_reset_email

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
