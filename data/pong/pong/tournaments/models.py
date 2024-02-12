from django.db import models
from django.core import validators

from tournaments.validators import ParticipantsValidator
from tournaments.managers import TournamentManager, ParticipantTournamentManager

from users.models import PongUser, Game


class Tournament(models.Model):
    class Meta:
        db_table = "tournament"


    name = models.CharField(
        max_length=32,
        validators=[validators.RegexValidator(regex="^[A-Za-z0-9!?*$:;,.()~ _-]{5,32}$")],
        db_column="name",
    )

    description = models.CharField(
        max_length=255,
        validators=[validators.RegexValidator(regex="^[A-Za-z0-9!?*$:;,.()~ _-]{5,255}$")],
        db_column="description",
    )

    # TODO: test ParticipantsValidator
    participants_num = models.IntegerField(
        db_column="participants_num",
        validators=[ParticipantsValidator(4, "wrong number of participants")]
    )

    finished = models.BooleanField(
        db_column="finished",
        default=False
    )

    # TODO: create TournamentManager
    objects = TournamentManager()

    def __str__(self):
        return f"id: {self.id}, name: {self.name}, n_parts: {self.participants_num}"

    def get_subscribed(self):
        return ParticipantTournament.objects.filter(tournament_id=self.id, level=1).count()

    def is_full(self):
        if self.participant.count() >= self.participants_num:
            return True
        return False


class ParticipantTournament(models.Model):
    class Meta:
        db_table = "participant_tournament"


    level = models.IntegerField(
        db_column="level",
        validators=[validators.MinValueValidator(0, "level cannot be negative")]
    )

    column = models.IntegerField(
        db_column="column",
        validators=[validators.MinValueValidator(0, "column cannot be negative")]
    )
    
    player = models.ForeignKey(
        PongUser,
        on_delete=models.CASCADE,
        related_name="+",
        db_column="player"
    )
    
    tournament = models.ForeignKey(
        Tournament,
        on_delete=models.CASCADE,
        related_name="participant",
        db_column="tournament_id"
    )

    game = models.ForeignKey(
        Game,
        on_delete=models.CASCADE,
        related_name="+",
        db_column="game_id"
    )

    # TODO: create ParticipantTournamentManager
    objects = ParticipantTournamentManager()

    def __str__(self):
        return f"player: {self.player_id}, game: {self.game_id}"


