from django.db import models

from users.views import generate_ticket_user

from pong.producers import NotificationProducer

class ParticipantTournamentManager(models.Manager):
    def create(self, level: int, player, tournament, game, **kwargs):
        participant_tournament = self.model(
            level=level,
            column=0,
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


class TournamentManager(models.Manager):
    def create(self, name: str, description: str, participants_num: int, **kwargs):
        tournament = self.model(
            name=name,
            description=description,
            participants_num=participants_num,
        )
        tournament.full_clean()
        tournament.save()
        return tournament

    def start_tournament_level(self, tournament, level):
        participants = tournament.participant.filter(level=level).order_by("column")
        matches = []
        match = []
        group = 1
        group_dim = 2 ** level

        # create matches
        for participant in participants:
            if participant.column in range((group - 1) * group_dim, group * group_dim + 1):
                match.append(match)
            else:
                match.append(None)
            if len(match) == 2:
                group += 1
                matches.append(match)
                match = []

        # create tickets
        for pair in matches:
            if None not in pair:
                # generate ticket
                ticket = generate_ticket_user(pair[0], pair[1])
                # send notification
                body = {"opponent": user.username, "requested": requested.username, "token": friends.token}
                NotificationProducer().publish(method="match_request_ntf", body=json.dumps(body))
            elif pair != [None, None]:
                user = pair[0] or pair[1]
                body = {"receiver": user.username, "body": f"But nobody came"}
                NotificationProducer().publish(method="info_ntf", body=json.dumps(body))

    def end_tournament(self, tournament, level):
        participants = tournament.participant.filter(level=1).order_by("column")
        winner = tournament.participant.filter(level=level)
        if winner.count() == 1:
            message = f"{winner.username} won the tournament: {tournament.name}"
        else:
            message = f"Nobody claimed the first place in the tournament: {tournament.name}"
        for participant in participants:
            body = {"receiver": participant.username, "body": message}
            NotificationProducer().publish(method="info_ntf", body=json.dumps(body))
        tournament.finished = True
        tournament.full_clean()
        tournament.save()
        return tournament
