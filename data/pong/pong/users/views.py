from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics

from users.models import PongUser
from users.serializers import PongUserSerializer

# Create your views here.
class CreateUser(generics.CreateAPIView):
    queryset = PongUser.objects.all()
    serializer_class = PongUserSerializer

@api_view(["POST"])
def generate_ticket(request):
    username_1 = request.data.get("username_1", "")
    username_2 = request.data.get("username_2", "")
    if username_1 == "" or username_2 == "" or username_1 == username_2:
        return Response({"message": "Invalid JSON format"}, status=400)
    try:
        pong_user_1 = PongUser.objects.get(pk=username_1)
        pong_user_2 = PongUser.objects.get(pk=username_2)
    except PongUser.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    pong_user_1 = PongUser.objects.generate_ticket(pong_user_1)
    ticket = pong_user_1.ticket
    PongUser.objects.update_ticket(pong_user_2, ticket)
    return Response({"ticket: ": ticket}, status=200)
