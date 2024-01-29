from django.db import models
from django.core import validators

from users.managers import PongUserManager, GameManager, ParticipantManager, StatsManager
from users.utils import Results


# Create your models here.

class PongUser(models.Model):
    class Meta:
        db_table = "pong_user"


    username = models.CharField(
        primary_key=True,
        max_length=32,
        validators=[validators.RegexValidator(regex="^[A-Za-z0-9!?*$~_-]{5,32}$")],
        db_column="username",
    )

    ticket = models.CharField(
        max_length=16,
        db_column="ticket",
        blank=True,
    )

    objects = PongUserManager()

    def __str__(self):
        return f"user: {self.username}, ticket: {self.ticket}"


# This model should be created when the game starts, before the task
class Game(models.Model):
    class Meta:
        db_table = "game"


    # By default uses the TIME_ZONE in settings.py
    created = models.DateTimeField(
        db_column="created",
        auto_now_add=True,
    )

    objects = GameManager()

    def get_created(self):
        return self.created.strftime('%Y/%m/%d-%H:%M:%S')

    def __str__(self):
        return f"game_id: {self.id}, created: {self.created.strftime('%Y/%m/%d-%H:%M:%S')}"


class Participant(models.Model):
    class Meta:
        db_table = "participant"

    
    player = models.ForeignKey(
        PongUser,
        on_delete=models.CASCADE,
        related_name="+",
        db_column="player"
    )
    
    game = models.ForeignKey(
        Game,
        on_delete=models.CASCADE,
        related_name="+",
        db_column="game_id"
    )

    objects = ParticipantManager()

    def __str__(self):
        return f"player: {self.player_id}, game: {self.game_id}"


class Stats(models.Model):
    class Meta:
        db_table = "stats"


    participant = models.OneToOneField(
        Participant,
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

    objects = StatsManager()

    def __str__(self):
        return f"player: {self.participant.player_id}, result: {self.result}, score: {self.score}"
