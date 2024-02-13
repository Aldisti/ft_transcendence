from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from rest_framework import filters
from rest_framework import pagination

from tournaments.models import Tournament, ParticipantTournament
from tournaments.serializers import TournamentSerializer
from tournaments.filters import MyFilterBackend

from users.models import PongUser, Game

import logging

import json

import time
import threading

logger = logging.getLogger(__name__)

class MyPageNumberPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'size'
    max_page_size = 10

class ListTournament(ListAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    pagination_class = MyPageNumberPagination
    permission_classes = []
    filter_backends = [MyFilterBackend, filters.OrderingFilter]
    search_fields = ["finished", "participants"]
    ordering_filters = ["title"]


class RetrieveTournament(RetrieveAPIView):
    queryset = Tournament.objects.all()
    permission_classes = []
    serializer_class = TournamentSerializer
    lookup_field = "id"

class CreateTournament(CreateAPIView):
    queryset = Tournament.objects.all()
    permission_classes = []
    serializer_class = TournamentSerializer

    def create(self, request, *args, **kwargs):
        player = request.pong_user
        if player is None:
            return Response({"message": "User not found"}, status=404)

        # call the create method and return error if needed
        response = super().create(request, *args, **kwargs)
        if response.status_code != 201:
            return response

        # register user to tournament
        tournament = Tournament.objects.get(pk=response.data["id"])
        game = Game.objects.create()
        participant_tournament = ParticipantTournament.objects.create(1, player, tournament, game)
        ParticipantTournament.objects.update_column(tournament, 1)
        
        # update the subscribed field in the response
        tour = Tournament.objects.get(pk=response.data["id"])
        response.data["subscribed"] = tour.get_subscribed()
        return response


@api_view(['POST'])
def register_tournament(request):
    player = request.pong_user
    if player is None:
        return Response({"message": "User not found"}, status=404)

    tournament_id = request.data.get('tournament_id', -1)
    try:
        tournament = Tournament.objects.get(pk=tournament_id)
    except Tournament.DoesNotExist:
        return Response({"message": "Tournament  not found"}, status=404)

    if tournament.is_full():
        return Response({"message": "Tournament is full"}, status=400)
    return Response(status=200)

    num_participants = tournament.get_subscribed()
    if num_participants % 2 == 0:
        game = Game.objects.create()
    else:
        game = tournament.participant.get(level=1, column=num_participants).game


    thread = threading.Thread(target=test)
    thread.start()


def test():
    pass
