from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import User
from accounts.serializers import UserSerializer

from authentication.serializers import MyTokenObtainPairSerializer


# Create your views here.


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
    try:
        token = RefreshToken(request.COOKIES.get('refresh_token'))
        return Response(
            {"access_token": str(token.access_token)},
            status=status.HTTP_200_OK
        )
    except TokenError:
        return Response("Invalid refresh token", status=status.HTTP_400_BAD_REQUEST)
