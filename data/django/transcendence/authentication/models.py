
from django.core import validators
from django.db import models

from accounts.models import User

from secrets import token_urlsafe
from uuid import uuid4


# Managers


class UserTokensManger(models.Manager):
    def create(self, user: User):
        user_tokens = self.model(user=user)
        user_tokens.full_clean()
        user_tokens.save()
        return user_tokens

    def clear_email_token(self, user_tokens):
        user_tokens.email_token = ""
        user_tokens.full_clean()
        user_tokens.save()
        return user_tokens

    def generate_email_token(self, user_tokens):
        token = uuid4()
        user_tokens.email_token = str(token)
        user_tokens.full_clean()
        user_tokens.save()
        return user_tokens

    def clear_password_token(self, user_tokens):
        user_tokens.password_token = ""
        user_tokens.full_clean()
        user_tokens.save()
        return user_tokens

    def generate_password_token(self, user_tokens):
        token = uuid4()
        user_tokens.password_token = str(token)
        user_tokens.full_clean()
        user_tokens.save()
        return user_tokens


class WebsocketTicketManager(models.Manager):
    def create(self, user_tokens):
        token = token_urlsafe(12)
        ticket = self.model(user_tokens=user_tokens, ticket=token)
        ticket.full_clean()
        ticket.save()
        return ticket


class UserTokens(models.Model):
    user = models.OneToOneField(
        to=User,
        on_delete=models.CASCADE,
        related_name="user_tokens",
        db_column="username",
        primary_key=True
    )
    email_token = models.CharField(
        db_column="email_token",
        max_length=36,
        blank=True,
        default="",
        validators=[validators.MinLengthValidator(36, message="Too short token")]
    )
    password_token = models.CharField(
        db_column="password_token",
        max_length=36,
        blank=True,
        default="",
        validators=[validators.MinLengthValidator(36, message="Too short token")]
    )

    objects = UserTokensManger()

    def is_resetting_password(self):
        return self.password_token != ""

    class Meta:
        db_table = "user_tokens"

    def __str__(self):
        return f"user: {self.user.username}, email_token: {self.email_token}"


class WebsocketTicket(models.Model):
    user_tokens = models.ForeignKey(
        UserTokens,
        db_column="user_tokens",
        on_delete=models.CASCADE,
        related_name="+",
    )

    ticket = models.CharField(
        max_length=16,
        db_column="ticket",
        unique=True,
    )

    creation_time = models.DateTimeField(
        db_column="creation_time",
        auto_now_add=True,
    )

    objects = WebsocketTicketManager()

    class Meta:
        db_table = "websocket_ticket"

    def __str__(self):
        return f"{self.user_tokens_id} has ticket: {self.ticket}"
