from channels.sessions import CookieMiddleware
from channels.middleware import BaseMiddleware
from channels.auth import UserLazyObject
from channels.db import database_sync_to_async
from authentication.models import WebsocketTicket
from accounts.models import User
from rest_framework_simplejwt.tokens import RefreshToken

import logging

logger = logging.getLogger(__name__)


@database_sync_to_async
def get_user(query_params: dict) -> User:
    if "ticket" not in query_params:
        raise ValueError("Ticket not found")
    try:
        ticket = WebsocketTicket.objects.get(ticket=query_params["ticket"])
    except WebsocketTicket.DoesNotExist:
        raise ValueError("Ticket not found in database")
    user = ticket.user_tokens.user
    #ticket.delete()
    return user


class QueryParamMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):
        if "query_string" not in scope:
            raise ValueError("QueryParamMiddleware was passed a scope "
                             + "that did not have a query_string key")
        query_string = scope.get("query_string").decode("latin1")
        strings = query_string.split("&")
        query_params = {}
        for string in strings:
           param = string.split("=")
           query_params[param[0]] = param[1]
        return await super().__call__(dict(scope, query_params=query_params), receive, send)


class CustomAuthMiddleware(BaseMiddleware):

    def populate_scope(self, scope):
        if "query_params" not in scope:
            raise ValueError("QueryParamMiddleware must be above CustomAuthMiddleware")
        if "user" not in scope:
            scope["user"] = UserLazyObject()

    async def __call__(self, scope, receive, send):
        scope = dict(scope)
        # check if the scope has cookies set an fill user with a useful placeholder
        self.populate_scope(scope)
        # get user from database
        scope["user"] = await get_user(scope["query_params"])
        #logger.warning(f"user: {scope['user']}")
        return await super().__call__(scope, receive, send)


# shortcut for applying all layers of custom auth in one
def CustomAuthMiddlewareStack(inner):
    return QueryParamMiddleware(CookieMiddleware(CustomAuthMiddleware(inner)))
