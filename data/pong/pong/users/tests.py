from django.test import TestCase
from django.core.exceptions import ValidationError

from users.models import PongUser


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
