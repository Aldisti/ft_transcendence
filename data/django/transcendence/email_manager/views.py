from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from email_manager.models import UserTokens
from email_manager.email_sender import send_password_email, send_tfa_code_email
from accounts.models import User
from two_factor_auth.models import UserTFA


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
    user_tfa = user.user_tfa
    if user_tfa.type in UserTFA.TYPES.values():
        user_tfa = UserTFA.objects.generate_url_token(user_tfa)
        return Response(data={'token': user_tfa.url_token}, status=200)
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
        return Response({"message" "Invalid password"}, status=400)
    user = User.objects.reset_user_password(user, password)
    user_tokens = UserTokens.objects.clear_password_token(user_tokens)
    # TODO: redirect to login page
    return Response(status=200)


@api_view(['GET'])
@permission_classes([])
def send_otp_code(request) -> Response:
    if request.auth is not None:
        user_tfa = request.user.user_tfa
    else:
        url_token = request.query_params.get("token")
        user_tfa = UserTFA.objects.get(url_token=url_token)
    if user_tfa.type == UserTFA.NONE:
        return Response(data={'message': 'user 2fa not active'}, status=400)
    send_tfa_code_email(user_tfa)
    return Response(data={'message': 'ok'}, status=200)
