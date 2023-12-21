from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from accounts.models import User
from accounts.serializers import UserSerializer

from authentication.serializers import MyTokenObtainPairSerializer
from authentication.permissions import IsModerator


# Create your views here.


def get_tokens(user: User) -> dict:
    ret = {}
    token = MyTokenObtainPairSerializer.get_token(user)
    ret["refresh_token"] = str(token)
    ret["access_token"] = str(token.access_token)
    return ret


@csrf_exempt
@api_view(['POST'])
@permission_classes([])
def login(request):
    user_serializer = UserSerializer(data=request.data)
    if user_serializer.is_valid():
        user = User.objects.get(pk=user_serializer.validated_data['username'])
        tokens = get_tokens(user)
        response = Response(tokens['access_token'], status=status.HTTP_200_OK)
        response.set_cookie("Refresh", tokens['refresh_token'])
        return response


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsModerator])
def user(request):
    print("auth")
    print(request.auth, type(request.auth), sep='\n')
    # print(request.auth.is_authenticated, request.auth.is_active, request.auth.is_superuser)
    print("user")
    print(request.user, type(request.user))
    print(f"role: {request.user.role}")
    print("data")
    print(request.data)
    return Response("info", status=status.HTTP_200_OK)
