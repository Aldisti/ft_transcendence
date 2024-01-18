"""
ASGI config for transcendence project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator

from chat.routing import chat_urlpatterns
from notifications.routing import notifications_urlpatterns
from transcendence.middleware import CustomAuthMiddlewareStack

import logging

logger = logging.getLogger(__name__)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendence.settings')

django_asgi_app = get_asgi_application()

# put in one place all the urlpatterns
websocket_urlpatterns = []
websocket_urlpatterns.extend(chat_urlpatterns)
websocket_urlpatterns.extend(notifications_urlpatterns)

logger.warning(f"websocket_urlpatterns: {websocket_urlpatterns}")

application = ProtocolTypeRouter({
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            CustomAuthMiddlewareStack(URLRouter(websocket_urlpatterns))
        )
    }
)
