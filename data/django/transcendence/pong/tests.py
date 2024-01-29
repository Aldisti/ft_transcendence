from django.test import TestCase

from pong.models import Lobby, Match, Statistic

from accounts.models import User, UserGame


class LobbyTests(TestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        user = User.objects.create_user('user1', 'user1@localhost', 'password')
        user_game = UserGame.objects.create(user, display_name="display_user")
        users = [User.objects.create_user(f"guest{i}", f"guest{i}@localhost", f"password{i}") for i in range(8)]
        guests = [UserGame.objects.create(user) for user in users]
        cls.user = user
        cls.user_game = user_game
        cls.users = users
        cls.guests = guests
        cls.name = 'Best Tournament Ever'

    def test_empty_creation(self) -> None:
        lobby = Lobby.objects.create(())
        self.assertEqual(lobby.name, '')
        self.assertEqual(lobby.host, '')
        self.assertListEqual(list(lobby.guests.all()), [])
        self.assertFalse(lobby.is_tournament)

    def test_full_creation(self) -> None:
        lobby = Lobby.objects.create(
            self.guests,
            host=self.user_game.display_name,
            name=self.name,
            is_tournament=True,
        )
        self.assertEqual(lobby.name, self.name)
        self.assertEqual(lobby.host, self.user_game.display_name)
        self.assertListEqual(list(lobby.guests.all()), self.guests)
        self.assertTrue(lobby.is_tournament)

    def test_add_guests(self) -> None:
        lobby = Lobby.objects.create(())
        self.assertListEqual(list(lobby.guests.all()), [])
        Lobby.objects.add_guests(lobby, self.guests)
        self.assertListEqual(list(lobby.guests.all()), self.guests)

    def test_remove_guests(self) -> None:
        lobby = Lobby.objects.create(self.guests)
        self.assertListEqual(list(lobby.guests.all()), self.guests)
        Lobby.objects.remove_guests(lobby, self.guests[:4])
        self.assertListEqual(list(lobby.guests.all()), self.guests[4:])


class MatchTests(TestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        user = User.objects.create_user('user1', 'user1@localhost', 'password')
        user_game = UserGame.objects.create(user, display_name="display_user")
        users = [User.objects.create_user(f"guest{i}", f"guest{i}@localhost", f"password{i}") for i in range(8)]
        guests = [UserGame.objects.create(user) for user in users]
        cls.user = user
        cls.user_game = user_game
        cls.users = users
        cls.guests = guests
        cls.name = 'Best Tournament Ever'
        cls.p1 = 'player1'
        cls.p2 = 'player2'

    def setUp(self) -> None:
        self.empty_lobby = Lobby.objects.create(())
        self.full_lobby = Lobby.objects.create(self.guests)

    def test_empty_creation(self) -> None:
        match = Match.objects.create(
            lobby=self.empty_lobby,
            player1=self.p1,
            player2=self.p2,
        )
        self.assertEqual(match.lobby, self.empty_lobby)
        self.assertEqual(match.player1, self.p1)
        self.assertEqual(match.player2, self.p2)
        self.assertEqual(match.duration_time, 0)
        self.assertListEqual(list(self.empty_lobby.matches.all()), [match])

    def test_full_creation(self) -> None:
        match = Match.objects.create(
            lobby=self.full_lobby,
            player1=self.p1,
            player2=self.p2,
        )
        self.assertEqual(match.lobby, self.full_lobby)
        self.assertEqual(match.player1, self.p1)
        self.assertEqual(match.player2, self.p2)
        self.assertEqual(match.duration_time, 0)
        self.assertListEqual(list(self.full_lobby.matches.all()), [match])
