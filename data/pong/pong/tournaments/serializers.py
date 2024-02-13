from django.core import validators

from rest_framework import serializers

from tournaments.models import Tournament
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
        fields = ["id", "title", "description", "participants", "subscribed", "finished", "registered"]
        extra_kwargs = {
            "id": {"read_only": True},
            "finished": {"read_only": True},
        }

    def create(self, validated_data):
        tournament = Tournament.objects.create(**validated_data)
        return tournament

