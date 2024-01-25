from django.db import models

from secrets import token_urlsafe

class PongUserManager(models.Manager):
    def create(self, username):
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
