from django.urls import path, include

from pong import views


urlpatterns = [
    path('matchmaking/', views.matchmaking, name='matchmaking'),
]
