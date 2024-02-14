from channels.sessions import CookieMiddleware
from channels.middleware import BaseMiddleware
from channels.auth import UserLazyObject
from channels.db import database_sync_to_async

from users.models import PongUser
from tournaments.models import ParticipantTournament

import logging


logger = logging.getLogger(__name__)


@database_sync_to_async
def get_user(query_params: dict):
    if "ticket" not in query_params:
        raise ValueError("Ticket not found in url")
    if "username" not in query_params:
        raise ValueError("Username not found in url")
    try:
        #logger.warning(f"username: {query_params['username']}\nticket: {query_params['ticket']}")
        user = PongUser.objects.get(pk=query_params['username'], ticket=query_params["ticket"])
    except PongUser.DoesNotExist:
        raise ValueError("User not found")
    user = PongUser.objects.delete_ticket(user)
    return user


@database_sync_to_async
def get_participant(user: PongUser, query_params: dict):
    if "tournament_id" not in query_params:
        return None
    try:
        participants = ParticipantTournament.objects.filter(player=user, tournament_id=query_params["tournament_id"])
        participant = participants.order_by("level")[-1]
    except ParticipantTournament.DoesNotExist:
        return None
    except IndexError:
        return None
    return participant


@database_sync_to_async
def get_token(participant, query_params: dict):
    if "token" not in query_params:
        raise ValueError("Token not found in url")
    token = query_params["token"]
    if participant is None:
        return token
    elif participant.player.tournament_ticket == token:
        PongUser.objects.delete_tournament_ticket(participant.player)
        return token
    raise ValueError("Token not found in url")


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


class AllAuthMiddleware(BaseMiddleware):

    def populate_scope(self, scope):
        if "query_params" not in scope:
            raise ValueError("QueryParamMiddleware must be above CustomAuthMiddleware")
        if "user" not in scope:
            scope["user"] = UserLazyObject()

    async def __call__(self, scope, receive, send):
        scope = dict(scope)
        # check if the scope has cookies set a fill user with a useful placeholder
        self.populate_scope(scope)
        # get user from database
        scope["user"] = await get_user(scope["query_params"])
        scope["participant"] = await get_participant(scope["user"], scope["query_params"])
        scope["token"] = await get_token(scope["participant"], scope["query_params"])
        #logger.warning(f"user: {scope['user']}")
        return await super().__call__(scope, receive, send)


# shortcut for applying all layers of custom auth in one
def AllAuthMiddlewareStack(inner):
    return QueryParamMiddleware(CookieMiddleware(AllAuthMiddleware(inner)))
