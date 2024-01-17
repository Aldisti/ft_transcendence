from channels.sessions import CookieMiddleware
from channels.middleware import BaseMiddleware
from channels.auth import UserLazyObject
from channels.db import database_sync_to_async
from accounts.models import User
from rest_framework_simplejwt.tokens import RefreshToken

import logging

logger = logging.getLogger(__name__)


@database_sync_to_async
def get_user(cookies: dict) -> User:
    if "refresh_token" not in cookies:
        raise ValueError("Refresh token not found")
    refresh_token = RefreshToken(cookies.get("refresh_token"))
    username = refresh_token["username"]
    user = User.objects.get(pk=username)
    return user


class CustomAuthMiddleware(BaseMiddleware):

    def populate_scope(self, scope):
        if "cookies" not in scope:
            raise ValueError("CookieMiddleware must be above CustomAuthMiddleware")
        if "user" not in scope:
            scope["user"] = UserLazyObject()

    async def __call__(self, scope, receive, send):
        scope = dict(scope)
        # check if the scope has cookies set an fill user with a useful placeholder
        self.populate_scope(scope)
        # get user from database
        scope["user"] = await get_user(scope["cookies"])
        #logger.warning(f"user: {scope['user']}")
        return await super().__call__(scope, receive, send)

# shortcut for applying all layers of custom auth in one
def CustomAuthMiddlewareStack(inner):
    return CookieMiddleware(CustomAuthMiddleware(inner))
