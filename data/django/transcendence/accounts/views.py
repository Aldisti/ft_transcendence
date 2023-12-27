from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.generics import RetrieveDestroyAPIView, ListAPIView
from rest_framework.exceptions import APIException
from rest_framework import filters
from accounts.paginations import MyPageNumberPagination
from accounts.serializers import CompleteUserSerializer
from accounts.models import User
from authentication.permissions import IsActualUser, IsAdmin, IsModerator

# Create your views here.


@api_view(['POST'])
@permission_classes([])
def registration(request):
    user_serializer = CompleteUserSerializer(data=request.data)
    if not user_serializer.is_valid():
        return Response(status=400)
    user = user_serializer.create(user_serializer.validated_data)
    serializer_response = CompleteUserSerializer(user)
    return Response(serializer_response.data, status=201)

@api_view(['PATCH'])
@permission_classes([IsAdmin])
def change_role(request):
    """
    Request: {"username": <username>, "role": <[U, M]>}
    """
    user_serializer = CompleteUserSerializer(data=request.data)
    if not user_serializer.is_valid():
        return Response(status=400)
    user = user_serializer.update_role(user_serializer.validated_data)
    return Response({ "username": user.username, "new_role": user.role }, status=200)

@api_view(['PATCH'])
@permission_classes([IsModerator])
def change_active(request):
    """
    Request: {"username": <username>, "banned": <[True, False]>}
    """
    user_serializer = CompleteUserSerializer(data=request.data)
    if not user_serializer.is_valid():
        return Response(status=400)
    user = user_serializer.update_active(user_serializer.validated_data)
    return Response({ "username": user.username, "banned": not user.active }, status=200)


class RetrieveDestroyUser(RetrieveDestroyAPIView):
    permission_classes = [IsActualUser|IsAdmin]
    queryset = User.objects.all()
    serializer_class = CompleteUserSerializer
    lookup_field = "username"


class ListUser(ListAPIView):
    queryset = User.objects.all()
    serializer_class = CompleteUserSerializer
    pagination_class = MyPageNumberPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["=username", "=email"]
    ordering_filters = ["username", "email"]
    ordering = ["username"]
