from django.urls import path, include

from pong import views


urlpatterns = [
    path('matchmaking/', views.matchmaking, name='matchmaking'),
    path('matches/', views.get_matches, name='get_matches'),
    path('tournaments/', include([
        path('', views.list_tournaments, name='list_tournaments'),
        path('<int:tour_id>/', views.retrieve_tournament, name='retrieve_tournament'),
        path('create/', views.create_tournament, name='create_tournament'),
        path('register/', views.register_tournament, name='register_tournament'),
        path('unregister/', views.unregister_tournament, name='unregister_tournament'),
        path('schema/<int:tournament_id>/', views.get_schema_tournament, name='get_schema_tournament'),
    ])),
]
