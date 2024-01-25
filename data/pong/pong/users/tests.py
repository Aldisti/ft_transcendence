from django.test import TestCase
from django.core.exceptions import ValidationError

from users.models import PongUser, Game, Participant, Stats
from users.utils import Results


# Create your tests here.

class UserPongManagerTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.pong_user = PongUser.objects.create("gpanico")

    def test_invalid_create(self):
        with self.assertRaises(ValidationError):
            PongUser.objects.create("Gpa")
        with self.assertRaises(ValidationError):
            PongUser.objects.create("012345678901234567890123456789123")
        with self.assertRaises(ValidationError):
            PongUser.objects.create("!@$%^&*")

    def test_valid_create(self):
        username = "01234!?*$~_-5"
        pong_user = PongUser.objects.create(username)
        self.assertEqual(pong_user.username, username)

    def test_generate_ticket(self):
        self.assertEqual(self.pong_user.ticket, "")
        self.pong_user = PongUser.objects.generate_ticket(self.pong_user)
        self.assertNotEqual(self.pong_user.ticket, "")

    def test_delete_ticket(self):
        self.pong_user = PongUser.objects.generate_ticket(self.pong_user)
        self.assertNotEqual(self.pong_user.ticket, "")
        self.pong_user = PongUser.objects.delete_ticket(self.pong_user)
        self.assertEqual(self.pong_user.ticket, "")

    def test_update_ticket(self):
        self.assertEqual(self.pong_user.ticket, "")
        valid_ticket = "0123456789012345"
        self.pong_user = PongUser.objects.update_ticket(self.pong_user, valid_ticket)
        self.assertEqual(self.pong_user.ticket, valid_ticket)
        invalid_ticket = "01234567890123456"
        with self.assertRaises(ValidationError):
            PongUser.objects.update_ticket(self.pong_user, invalid_ticket)

    def test_valid_str_repr(self):
        pong_user_str = f"user: {self.pong_user.username}, ticket: {self.pong_user.ticket}"
        self.assertEqual(self.pong_user.__str__(), pong_user_str)


class GameManagerTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.game = Game.objects.create()

    def test_valid_create(self):
        game = Game.objects.create()
        game_check = Game.objects.get(pk=game.id)
        self.assertEqual(game, game_check)
        
    def test_valid_str_repr(self):
        game_str = f"game_id: {self.game.id}, created: {self.game.created.strftime('%Y/%m/%d-%H:%M:%S')}"
        self.assertEqual(self.game.__str__(), game_str)


class ParticipantManagerTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        pong_user = PongUser.objects.create("gpanico")
        game = Game.objects.create()
        cls.pong_user = pong_user
        cls.game = game
        cls.participant = Participant.objects.create(player=pong_user, game=game)

    def test_valid_create(self):
        participant = Participant.objects.create(self.pong_user, self.game)
        participant_check = Participant.objects.get(pk=participant.id)
        self.assertEqual(participant, participant_check)
        
    def test_valid_str_repr(self):
        participant_str = f"player: {self.participant.player_id}, game: {self.participant.game_id}"
        self.assertEqual(self.participant.__str__(), participant_str)



class StatsManagerTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        pong_user = PongUser.objects.create("gpanico")
        game = Game.objects.create()
        participant = Participant.objects.create(player=pong_user, game=game)
        participant_2 = Participant.objects.create(player=pong_user, game=game)
        cls.pong_user = pong_user
        cls.game = game
        cls.participant = participant
        cls.participant_2 = participant_2
        cls.stats = Stats.objects.create(participant, 0, Results.WIN)
        cls.invalid_result = "test"
        
    def test_invalid_create(self):
        with self.assertRaises(ValueError):
            stats = Stats.objects.create(self.participant_2, 0, self.invalid_result)
        with self.assertRaises(ValidationError):
            stats = Stats.objects.create(self.participant_2, -1, Results.WIN)

    def test_valid_create(self):
        stats = Stats.objects.create(self.participant_2, 0, Results.WIN)
        stats_check = Stats.objects.get(pk=stats.id)
        self.assertEqual(stats, stats_check)
        self.assertEqual(stats.score, 0)
        self.assertEqual(stats.result, Results.WIN)

    def test_valid_update_score(self):
        stats = Stats.objects.update_score(self.stats, 10)
        self.assertEqual(stats.score, 10)

    def test_invalid_update_score(self):
        with self.assertRaises(ValidationError):
            stats = Stats.objects.update_score(self.stats, -10)

    def test_valid_update_result(self):
        stats = Stats.objects.update_result(self.stats, Results.DRAW)
        self.assertEqual(stats.result, Results.DRAW)

    def test_invalid_update_result(self):
        with self.assertRaises(ValueError):
            stats = Stats.objects.update_result(self.stats, self.invalid_result)
        
    def test_valid_str_repr(self):
        stats_str = f"player: {self.stats.participant.player_id}, result: {self.stats.result}, score: {self.stats.score}"
        self.assertEqual(self.stats.__str__(), stats_str)
