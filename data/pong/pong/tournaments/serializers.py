from django.core import validators

from rest_framework import serializers

from tournaments.models import Tournament, ParticipantTournament
from tournaments.validators import ParticipantsValidator

import logging

logger = logging.getLogger(__name__)


class TournamentSerializer(serializers.ModelSerializer):
    title = serializers.CharField(
        source="name",
        validators=[validators.RegexValidator(regex="^[A-Za-z0-9!?*$:;,.()~ _-]{5,32}$")]
    )

    participants = serializers.IntegerField(
        source="participants_num",
        validators=[ParticipantsValidator(4, "wrong number of participants")]
    )

    subscribed = serializers.IntegerField(
        source="get_subscribed",
        read_only=True,
    )

    registered = serializers.ListField(
        source="get_participants",
        read_only=True,
    )


    class Meta:
        model = Tournament
        fields = ["id", "title", "description", "participants", "subscribed", "finished", "registered", "start_date"]
        extra_kwargs = {
            "id": {"read_only": True},
            "finished": {"read_only": True},
            "registered": {"read_only": True},
        }

    def create(self, validated_data):
        tournament = Tournament.objects.create(**validated_data)
        return tournament


class ParticipantTournamentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="get_username",
        read_only=True
    )

    winner = serializers.BooleanField(
        source="is_winner",
        read_only=True,
    )

    class Meta:
        model = ParticipantTournament
        fields = ["username", "display_name", "winner", "column"]
        extra_kwargs =  {
            "display_name": {"read_only": True},
            "column": {"read_only": True},
        }


def serialize_tournament_matches(participants, opponents, games) -> dict:
    data = []
    for participant, opponent, game in zip(participants, opponents, games):
        if participant.winner:
            continue
        opponent_stats = getattr(opponent, "stats", None)
        opponent_score = getattr(opponent_stats, "score", 0)
        participant_stats = getattr(participant, "stats", None)
        participant_score = getattr(participant_stats, "score", 0)
        match = {
            "opponent": None if opponent is None else opponent.player_id,
            "scores": [participant_score, opponent_score],
            "date": game.get_created(),
            "tournament_id": participant.tournament_id,
        }
        data.append(match)
    return data
