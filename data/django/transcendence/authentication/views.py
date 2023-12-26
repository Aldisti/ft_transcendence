from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import User
from accounts.serializers import UserSerializer

from authentication.serializers import MyTokenObtainPairSerializer
from authentication.models import JwtToken


@api_view(['POST'])
def logout(request):
    ref_token = RefreshToken(request.COOKIES.get('refresh_token'))
    jwt_token = JwtToken.objects.create(ref_token)
    return Response(str(jwt_token), status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([])
def login(request):
    user_serializer = UserSerializer(data=request.data)
    if user_serializer.is_valid():
        user = User.objects.get(pk=user_serializer.validated_data['username'])
        if user.check_password(user_serializer.validated_data['password']):
            token = MyTokenObtainPairSerializer.get_token(user)
            response = Response(
                {"access_token": str(token.access_token)},
                status=status.HTTP_200_OK,
            )
            response.set_cookie("refresh_token", str(token))
            return response
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([])
def refresh_token(request):
    ref_token = RefreshToken(request.COOKIES.get('refresh_token'))
    try:
        if JwtToken.objects.filter(token=ref_token['csrf']).exists():
            raise TokenError
        token = RefreshToken(request.COOKIES.get('refresh_token'))
        return Response(
            {"access_token": str(token.access_token)},
            status=status.HTTP_200_OK,
        )
    except TokenError:
        return Response("Invalid refresh token", status=status.HTTP_400_BAD_REQUEST)
