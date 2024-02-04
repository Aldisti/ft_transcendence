from django.urls import path

from notifications import consumers

notifications_urlpatterns = [
    path("ws/notification/socket/", consumers.NotificationConsumer.as_asgi()),
]
