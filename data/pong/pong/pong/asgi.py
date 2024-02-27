"""
ASGI config for transcendence project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

from django.core.asgi import get_asgi_application

django_asgi_app = get_asgi_application()

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator

from game.routing import game_urlpatterns
from tournaments.routing import tournaments_urlpatterns
from matchmaking.routing import urlpatterns as queue_urlpatterns
from game.middlewares import CustomAuthMiddlewareStack
from tournaments.middlewares import AllAuthMiddlewareStack

import logging


logger = logging.getLogger(__name__)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pong.settings')

# put in one place all the urlpatterns
websocket_urlpatterns = []
websocket_urlpatterns.extend(game_urlpatterns)
websocket_urlpatterns.extend(queue_urlpatterns)
websocket_urlpatterns.extend(tournaments_urlpatterns)

logger.warning(f"websocket_urlpatterns: {websocket_urlpatterns}")

application = ProtocolTypeRouter({
        "http": django_asgi_app,
        "websocket": AllAuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
    }
)
