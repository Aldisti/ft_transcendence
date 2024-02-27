from django.db import models

from users.views import generate_ticket_user, generate_tournament_ticket_user

from pong.producers import NotificationProducer
from users.utils import Results

import json

import math

import logging

logger = logging.getLogger(__name__)

class ParticipantTournamentManager(models.Manager):
    def create(self, level: int, player, tournament, game, **kwargs):
        display_name = kwargs.get("display_name", "player")
        participant_tournament = self.model(
            level=level,
            column=0,
            display_name=display_name,
            player=player,
            tournament=tournament,
            game=game,
        )
        participant_tournament.full_clean()
        participant_tournament.save()
        return participant_tournament

    def update_column(self, participant_tournament, column: int, **kwargs):
        participant_tournament.column = column
        participant_tournament.full_clean()
        participant_tournament.save()
        return participant_tournament

    def update_entered(self, participant_tournament, entered: bool, **kwargs):
        participant_tournament.entered = entered
        participant_tournament.full_clean()
        participant_tournament.save()
        return participant_tournament

    def update_game(self, participant_tournament, game, **kwargs):
        participant_tournament.game = game
        participant_tournament.full_clean()
        participant_tournament.save()
        return participant_tournament


    def update_winner(self, participant_tournament, winner: bool, **kwargs):
        participant_tournament.winner = winner
        participant_tournament.full_clean()
        participant_tournament.save()
        return participant_tournament


class TournamentManager(models.Manager):
    def create(self, name: str, description: str, participants_num: int, start_date, **kwargs):
        tournament = self.model(
            name=name,
            description=description,
            participants_num=participants_num,
            start_date=start_date,
        )
        tournament.full_clean()
        tournament.save()
        return tournament

    def start_tournament(self, tournament):
        tournament.started = True
        tournament.full_clean()
        tournament.save()
        return tournament

    def start_tournament_level(self, tournament, level):
        participants = tournament.participant.filter(level=level).order_by("column")
        logger.warning(f"PARTICIPANTS: {participants}")

        for i in range(math.ceil(participants.count() / 2)):
            # get users
            logger.warning(f"COLUMN: {(i * 2)}")
            logger.warning(f"COLUMN: {(i * 2 + 1)}")
            try:
                participant_1 = participants.get(column=(i * 2 + 1))
                user_1 = participant_1.player
            except Exception:
                user_1 = None
            try:
                participant_2 = participants.get(column=(i * 2 + 2))
                user_2 = participant_2.player
            except Exception:
                user_2 = None

            if user_1 is None and user_2 is None:
                continue
            elif user_1 is None or user_2 is None:
                user = user_1 or user_2
                body = {"receiver": user.username, "body": f"But nobody came"}
                NotificationProducer().publish(method="info_ntf", body=json.dumps(body))
            else:
                # generate ticket
                ticket = generate_tournament_ticket_user(user_1, user_2)
                # send notification
                logger.warning(f"SENDING NTF TO {user_1.username} {user_2.username}")
                data = {
                    "requested": user_2.username,
                    "body": {
                        "opponent": user_1.username,
                        "opponent_display": participant_1.display_name,
                        "user_display": participant_2.display_name,
                        "token": ticket,
                        "tournament_id": tournament.id,
                    },
                }
                NotificationProducer().publish(method="tournament_request_ntf", body=json.dumps(data))
                data = {
                    "requested": user_1.username,
                    "body": {
                        "opponent": user_2.username,
                        "opponent_display": participant_2.display_name,
                        "user_display": participant_1.display_name,
                        "token": ticket,
                        "tournament_id": tournament.id,
                    },
                }
                NotificationProducer().publish(method="tournament_request_ntf", body=json.dumps(data))

    def end_tournament(self, tournament, level):
        participants = tournament.participant.filter(level=1).order_by("column")
        winner = tournament.participant.filter(level=level)
        logger.warning(f"PARTICIPANTS: {participants}")
        logger.warning(f"WINNER: {winner}")
        if winner.count() == 1:
            message = f"{winner[0].display_name} won the tournament: {tournament.name}"
        else:
            message = f"Nobody claimed the first place in the tournament: {tournament.name}"
        for participant in participants:
            body = {"receiver": participant.player.username, "body": message}
            NotificationProducer().publish(method="info_ntf", body=json.dumps(body))
        tournament.finished = True
        tournament.full_clean()
        tournament.save()
        return tournament


class StatsTournamentManager(models.Manager):
    def create(self, participant, score, result, **kwargs):
        # this can be deleted
        if result not in Results.RESULTS_LIST:
            raise ValueError("Invalid result")
        stats = self.model(participant=participant, score=score, result=result)
        stats.full_clean()
        stats.save()
        return stats

    def update_score(self, stats, score):
        stats.score = score
        stats.full_clean()
        stats.save()
        return stats

    def update_result(self, stats, result):
        # this can be deleted
        if result not in Results.RESULTS_LIST:
            raise ValueError("Invalid result")
        stats.result = result
        stats.full_clean()
        stats.save()
        return stats
