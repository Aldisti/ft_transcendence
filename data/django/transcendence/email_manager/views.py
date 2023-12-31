from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from email_manager.models import UserTokens
from email_manager.email_sender import send_password_email
from accounts.models import User

# Create your views here.


@api_view(['GET'])
@permission_classes([])
def email_token_validation(request):
    token = request.query_params.get("token", "")
    if len(token) != 36:
        return Response({"message": "Invalid token"}, status=400)
    try:
        user_tokens = UserTokens.objects.filter(email_token=token)[0]
        user = user_tokens.user
    except IndexError:
        return Response({"message": "Token not found"}, status=404)
    user_tokens = UserTokens.objects.clear_email_token(user_tokens)
    user = User.objects.update_user_verified(user, verified=True)
    # TODO: redirect to login page
    return Response(status=200)

@api_view(['POST'])
@permission_classes([])
def password_recovery(request):
    data = request.data
    username = data.get("username", "")
    try:
        user = User.objects.get(pk=username)
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    send_password_email(user)
    return Response(status=200)

@api_view(['POST'])
@permission_classes([])
def password_reset(request):
    token = request.query_params.get("token", "")
    if len(token) != 36:
        return Response({"message": "Invalid token"}, status=400)
    try:
        user_tokens = UserTokens.objects.filter(password_token=token)[0]
        user = user_tokens.user
    except IndexError:
        return Response({"message": "Token not found"}, status=404)
    password = request.data.get("password", "")
    if password == "":
        return Respose({"message" "Invalid password"}, status=400)
    user = User.objects.reset_user_password(user, password)
    user_tokens = UserTokens.objects.clear_password_token(user_tokens)
    # TODO: redirect to login page
    return Response(status=200)
