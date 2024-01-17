from django.core import validators
from django.db import models

from pong.managers import LobbyManager, MatchManager, StatisticsManager

from accounts.models import UserGame


class Lobby(models.Model):

    class Meta:
        db_table = 'lobby'

    guests = models.ManyToManyField(
        to=UserGame,
        # TODO: on_delete what?
        related_name='lobbies',
    )
    name = models.CharField(
        db_column="name",
        max_length=32,
        blank=True,
        default="",
    )
    host = models.CharField(
        db_column="host",
        max_length=32,
        blank=True,
        default="",
        validators=[validators.RegexValidator(regex="^[A-Za-z0-9!?*$~_-]{5,32}$")],
    )
    is_tournament = models.BooleanField(
        db_column="is_tournament",
        default=False,
    )
    creation_time = models.DateTimeField(
        db_column="creation_time",
        auto_now_add=True,
    )

    objects = LobbyManager()

    def __str__(self) -> str:
        return (f"id: {self.id}, "
                f"name: {self.name}, "
                f"host: {self.host}, "
                f"guest: {len(self.guests.all())}, "
                f"tournament: {self.is_tournament}, "
                f"creation_time: {self.creation_time}")


class Match(models.Model):

    class Meta:
        db_table = 'match'

    lobby = models.ForeignKey(
        to=Lobby,
        on_delete=models.CASCADE,
        related_name="matches",
        db_column="lobby_id",
    )
    player1 = models.CharField(
        db_column="player1",
        max_length=32,
        validators=[validators.RegexValidator(regex="^[A-Za-z0-9!?*$~_-]{5,32}$")],
    )
    player2 = models.CharField(
        db_column="player2",
        max_length=32,
        validators=[validators.RegexValidator(regex="^[A-Za-z0-9!?*$~_-]{5,32}$")],
    )
    start_time = models.DateTimeField(
        db_column="start_time",
        auto_now_add=True,
    )
    duration_time = models.IntegerField(
        db_column="duration_time",
        default=0,
        help_text="match duration in seconds",
    )

    objects = MatchManager()

    def __str__(self) -> str:
        return (f"id: {self.id}, "
                f"lobby_id: {self.lobby_id}, "
                f"player1: {self.player1}, "
                f"player2: {self.player2}, "
                f"start_time: {self.start_time}, "
                f"duration_time: {self.duration_time}")


class Statistics(models.Model):

    class Meta:
        db_table = 'stats'

    match = models.OneToOneField(
        to=Match,
        on_delete=models.CASCADE,
        related_name="stats",
        primary_key=True,
        db_column="match",
    )
    winner = models.CharField(
        db_column="winner",
        max_length=32,
        default="",
        validators=[validators.RegexValidator(regex="^[A-Za-z0-9!?*$~_-]{5,32}$")],
    )
    goals_p1 = models.IntegerField(
        db_column="goals_p1",
        default=0,
    )
    goals_p2 = models.IntegerField(
        db_column="goals_p2",
        default=0,
    )
    ball_touch_p1 = models.IntegerField(
        db_column="ball_touch_p1",
        default=0,
    )
    ball_touch_p2 = models.IntegerField(
        db_column="ball_touch_p2",
        default=0,
    )
    avg_position_p1 = models.IntegerField(
        db_column="avg_position_p1",
        default=0,
    )
    avg_position_p2 = models.IntegerField(
        db_column="avg_position_p2",
        default=0,
    )
    racket_zone_p1 = models.IntegerField(
        db_column="racket_zone_p1",
        default=0,
    )
    racket_zone_p2 = models.IntegerField(
        db_column="racket_zone_p2",
        default=0,
    )

    objects = StatisticsManager()
