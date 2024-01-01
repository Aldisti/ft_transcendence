from wsgiref import headers

from rest_framework import status
from rest_framework.decorators import APIView, api_view, permission_classes
from rest_framework.response import Response

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from django.template import loader
from django.shortcuts import render

from authentication.serializers import MyTokenObtainPairSerializer
from authentication.utils import generate_token
from authentication.models import JwtToken

from accounts.models import User
from accounts.serializers import UserSerializer

from transcendence.settings import (API, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI,
                                    RESPONSE_TYPE, API_URL, API_INFO)

from datetime import datetime
from urllib.parse import quote
import requests


@api_view(['GET', 'POST'])
@permission_classes([])
def redirect_view(request):
    code = request.GET.get('code')
    state = request.GET.get('state')
    params = {
        'grant_type': 'authorization_code',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'state': state,
    }
    x = requests.post(API_URL, json=params)
    access_token = x.json().get('access_token')
    print(access_token)

    hs = {
        'Authorization': f"Bearer {access_token}",
    }
    x = requests.get(API_INFO, headers=hs)
    print(x.json())
    # return Response(f"status: {x.status_code} json: {x.json()}", status=status.HTTP_200_OK)
    return render(request, 'home.html', x.json())


@api_view(['GET', 'POST'])
@permission_classes([])
def test_api1(request):
    state = generate_token(32)
    context = {
        'api': API,
        'client_id': CLIENT_ID,
        'redirect_uri': quote(REDIRECT_URI),
        'state': state,
        'response_type': RESPONSE_TYPE,
    }
    return render(request, 'test_api.html', context)


@api_view(['GET', 'POST'])
@permission_classes([])
def home(request):
    context = {
        'headers': request.headers,
        'body': request.body,
        'GET': request.GET,
        'POST': request.POST,
    }
    return Response(context, status=status.HTTP_200_OK)




class LogoutView(APIView):
    throttle_scope = 'auth'

    def post(self, request) -> Response:
        ref_token = RefreshToken(request.COOKIES.get('refresh_token'))
        try:
            JwtToken.objects.create(ref_token)
        except ValueError or TokenError:
            return Response(
                "Invalid token",
                status=status.HTTP_400_BAD_REQUEST
            )
        response = Response(status=status.HTTP_200_OK)
        response.set_cookie("refresh_token", "removed",
                            max_age=0,
                            # secure=True,
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
                    return Response("User isn't active", status=status.HTTP_400_BAD_REQUEST)
                token = MyTokenObtainPairSerializer.get_token(user)
                response = Response(
                    {"access_token": str(token.access_token)},
                    status=status.HTTP_200_OK,
                )
                response.set_cookie("refresh_token", str(token),
                                    # secure=True
                                    )
                return response
        return Response("Invalid username or password", status=status.HTTP_400_BAD_REQUEST)


class RefreshView(APIView):
    throttle_scope = 'auth'
    permission_classes = []

    def post(self, request) -> Response:
        if request.auth is not None:
            return Response(
                "Cannot refresh with valid access token",
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            token = RefreshToken(request.COOKIES.get('refresh_token'))
            if JwtToken.objects.filter(token=token['csrf']).exists():
                raise TokenError()
            return Response(
                {"access_token": str(token.access_token)},
                status=status.HTTP_200_OK,
            )
        except TokenError:
            return Response(
                "Invalid refresh token",
                status=status.HTTP_400_BAD_REQUEST
            )
