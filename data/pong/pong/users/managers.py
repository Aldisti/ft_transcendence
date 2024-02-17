from django.db import models

from users.utils import Results

from secrets import token_urlsafe


class PongUserManager(models.Manager):
    def create(self, username, **kwargs):
        pong_user = self.model(username=username)
        pong_user.full_clean()
        pong_user.save()
        return pong_user

    def generate_ticket(self, pong_user):
        pong_user.ticket = token_urlsafe(12)
        pong_user.full_clean()
        pong_user.save()
        return pong_user

    def update_ticket(self, pong_user, ticket):
        pong_user.ticket = ticket
        pong_user.full_clean()
        pong_user.save()
        return pong_user

    def delete_ticket(self, pong_user):
        pong_user.ticket = ""
        pong_user.full_clean()
        pong_user.save()
        return pong_user

    def generate_tournament_ticket(self, pong_user):
        pong_user.tournament_ticket = token_urlsafe(12)
        pong_user.full_clean()
        pong_user.save()
        return pong_user

    def update_tournament_ticket(self, pong_user, tournament_ticket):
        pong_user.tournament_ticket = tournament_ticket
        pong_user.full_clean()
        pong_user.save()
        return pong_user

    def delete_tournament_ticket(self, pong_user):
        pong_user.tournament_ticket = ""
        pong_user.full_clean()
        pong_user.save()
        return pong_user

    def generate_match_token(self, pong_user):
        pong_user.match_token = token_urlsafe(12)
        pong_user.full_clean()
        pong_user.save()
        return pong_user

    def update_match_token(self, pong_user, match_token):
        pong_user.match_token = match_token
        pong_user.full_clean()
        pong_user.save()
        return pong_user

    def delete_match_token(self, pong_user):
        pong_user.match_token = ""
        pong_user.full_clean()
        pong_user.save()
        return pong_user


class GameManager(models.Manager):
    def create(self, **kwargs):
        game = self.model()
        game.full_clean()
        game.save()
        return game


class ParticipantManager(models.Manager):
    def create(self, player, game, **kwargs):
        participant = self.model(player=player, game=game)
        participant.full_clean()
        participant.save()
        return participant


class StatsManager(models.Manager):
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
