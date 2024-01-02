
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from oauth2.info import *
from oauth2 import requests as rq
from oauth2.utils import shrink_dict

from authentication.serializers import MyTokenObtainPairSerializer

from accounts.models import User

from transcendence.settings import TZ

from random import SystemRandom
from datetime import datetime
from base64 import b64encode
import requests


@api_view(['GET'])
@permission_classes([])
def callback(request):
    request_body = USER_INFO_DATA.copy()
    request_body['code'] = request.GET.get('code')
    request_body['state'] = request.GET.get('state')
    # try:
    #     data = rq.request('POST', API_TOKEN, body=request_body)
    #     request_headers = {'Authorization': f"Bearer {data.get('access_token')}"}
    #     data = rq.request('GET', API_USER_INFO, headers=request_headers)
    # except rq.APIException as e:
    #     return Response(e.message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    api_response = requests.post(API_TOKEN, json=request_body)
    if api_response.status_code != 200:
        return Response(f"api failed {api_response.status_code}",
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    request_headers = {'Authorization': f"Bearer {api_response.json().get('access_token')}"}
    api_response = requests.get(API_USER_INFO, headers=request_headers)
    if api_response.status_code != 200:
        return Response(f"api failed {api_response.status_code}",
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    data = api_response.json()
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
