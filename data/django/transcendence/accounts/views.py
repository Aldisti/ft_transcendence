from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import RetrieveDestroyAPIView, ListAPIView
from accounts.serializers import CompleteUserSerializer
from accounts.models import User


# Create your views here.

@api_view(['POST'])
def registration(request):
    user_serializer = CompleteUserSerializer(data=request.data)
    if not user_serializer.is_valid():
        return Response(status=400)
    user = user_serializer.create(user_serializer.validated_data)
    serializer_response = CompleteUserSerializer(user)
    return Response(serializer_response.data, status=201)

class RetrieveDestroyUser(RetrieveDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = CompleteUserSerializer

class ListUser(ListAPIView):
    queryset = User.objects.all()
    serializer_class = CompleteUserSerializer
