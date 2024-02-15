from django.urls import path, include

from pong import views


urlpatterns = [
    path('matchmaking/', views.matchmaking, name='matchmaking'),
    path('tournaments/', views.list_tournaments, name='list_tournaments'),
    path('tournaments/<int:tour_id>/', views.retrieve_tournament, name='retrieve_tournament'),
    path('tournaments/create/', views.create_tournament, name='create_tournament'),
    path('tournaments/register/', views.register_tournament, name='register_tournament'),
    path('tournaments/unregister/', views.unregister_tournament, name='unregister_tournament'),
]
