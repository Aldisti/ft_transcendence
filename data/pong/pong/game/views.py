from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.responses import Response

from users.models import Game, Participant

# Create your views here.

@api_view(["GET"])
def get_matches(request):
    player = request.pong_user
    if player is None:
        return Response({"message": "User not found"}, status = 404)
