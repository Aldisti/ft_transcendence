from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import RetrieveDestroyAPIView, ListAPIView
from rest_framework.exceptions import APIException
from rest_framework import filters
from accounts.paginations import MyPageNumberPagination
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
    lookup_field = "username"


class ListUser(ListAPIView):
    queryset = User.objects.all()
    serializer_class = CompleteUserSerializer
    pagination_class = MyPageNumberPagination
#    order_field = "username"
#    order_type = "DESC"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["=username", "=email"]
    ordering_filters = ["username", "email"]
    ordering = ["username"]

#    def get_queryset(self):
#        order_field = self.request.query_params.get("field", self.order_field)
#        order_type = self.request.query_params.get("type", self.order_type)
#        order = ("" if order_type == "ASC" else "-") + order_field
#        queryset = User.objects.all().order_by(order)
#        return queryset
