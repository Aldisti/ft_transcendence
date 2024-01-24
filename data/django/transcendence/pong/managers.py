
from django.db import models

from accounts.models import UserGame


class LobbyManager(models.Manager):
    def create(self, guests: list[UserGame] | tuple[UserGame] = (), **kwargs):
        kwargs.setdefault('name', '')
        kwargs.setdefault('host', '')
        kwargs.setdefault('is_tournament', False)

        lobby = self.model(**kwargs)
        lobby.full_clean()
        lobby.save()
        if len(guests) > 0:
            lobby.guests.add(*guests)
            lobby.full_clean()
            lobby.save()
        return lobby

    def add_guests(self, lobby, guests: list[UserGame]):
        lobby.guests.add(*guests)
        lobby.full_clean()
        lobby.save()
        return lobby

    def remove_guests(self, lobby, guests: list[UserGame]):
        lobby.guests.remove(*guests)
        lobby.full_clean()
        lobby.save()
        return lobby

    def update_name(self, lobby, name: str):
        lobby.name = name
        lobby.full_clean()
        lobby.save()
        return lobby

    def update_host(self, lobby, host: str):
        lobby.host = host
        lobby.full_clean()
        lobby.save()
        return lobby


class MatchManager(models.Manager):
    def create(self, lobby, player1, player2):
        match = self.model(lobby=lobby, player1=player1, player2=player2)
        match.full_clean()
        match.save()
        return match

    def update_duration_time(self, match, duration: int):
        match.duration = duration
        match.full_clean()
        match.save()
        return match


class StatisticsManager(models.Manager):
    def create(self, match, **kwargs):
        stats = self.model(match=match, **kwargs)
        stats.full_clean()
        stats.save()
        return stats
