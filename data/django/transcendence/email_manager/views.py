from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from email_manager.models import UserTokens
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
