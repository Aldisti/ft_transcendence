from django.urls import path, include
from pong import consumers

pong_urlpatterns = [
    path('ws/pong/queue/', consumers.QueueConsumer.as_asgi()),
]
