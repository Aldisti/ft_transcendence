from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from authentication.serializers import MyTokenObtainPairSerializer
from authentication.models import JwtToken

from accounts.models import User
from accounts.serializers import UserSerializer


@api_view(['POST'])
def logout(request):
    ref_token = RefreshToken(request.COOKIES.get('refresh_token'))
    JwtToken.objects.create(ref_token)
    response = Response("logout", status=status.HTTP_200_OK)
    response.set_cookie("refresh_token", "removed", max_age=0)
    return response


@api_view(['POST'])
@permission_classes([])
def login(request):
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
            response.set_cookie("refresh_token", str(token))
            return response
    return Response("Invalid username or password", status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([])
def refresh_token(request):
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
