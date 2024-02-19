from django.db import models
from django.core import validators

from tournaments.validators import ParticipantsValidator, StartDateValidator
from tournaments.managers import TournamentManager, ParticipantTournamentManager, StatsTournamentManager

from users.models import PongUser, Game
from users.utils import Results

import logging


logger = logging.getLogger(__name__)


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

    started = models.BooleanField(
        db_column="started",
        default=False
    )

    start_date = models.DateTimeField(
        db_column="start_date",
        validators=[StartDateValidator("invalid start date")],
        blank=True,
        null=True,
    )

    # TODO: create TournamentManager
    objects = TournamentManager()

    def __str__(self):
        return f"id: {self.id}, name: {self.name}, n_parts: {self.participants_num}"

    def get_subscribed(self, level=1):
        return self.participant.filter(level=level).count()

    def get_participants(self, level=1):
        return [participant.player.username for participant in self.participant.filter(level=level).order_by("column")]

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
        related_name="participant_tournament",
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
        related_name="participant_tournament",
        db_column="game_id"
    )

    entered = models.BooleanField(
        db_column="entered",
        default=False,
    )

    display_name = models.CharField(
        max_length=32,
        validators=[validators.RegexValidator(regex="^[A-Za-z0-9!?*$:;,.()~ _-]{5,32}$")],
        db_column="display_name",
        blank=True,
        default="",
    )

    # TODO: create ParticipantTournamentManager
    objects = ParticipantTournamentManager()

    def __str__(self):
        return f"player: {self.player_id}, game: {self.game_id}, level: {self.level}, column: {self.column}"

    def get_username(self):
        return self.player.username

    def is_winner(self):
        stats = getattr(self, "stats", None)
        result = getattr(stats, "result", Results.LOSE)
        if result == Results.WIN:
            return True
        return False


class StatsTournament(models.Model):
    class Meta:
        db_table = "stats_tournament"


    participant = models.OneToOneField(
        ParticipantTournament,
        on_delete=models.CASCADE,
        db_column="participant_id",
        related_name="stats",
    )

    # TODO: ask mpaterno if this should be capped
    score = models.IntegerField(
        db_column="score",
        validators=[validators.MinValueValidator(0, "score cannot be negative")]
    )

    result = models.CharField(
        db_column="result",
        max_length=10,
        choices=Results.RESULTS_CHOICES
    )

    objects = StatsTournamentManager()

    def __str__(self):
        return f"player: {self.participant.player_id}, result: {self.result}, score: {self.score}"
