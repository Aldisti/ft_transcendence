from django.urls import path
from tournaments import views

urlpatterns = [
    path('', views.ListTournament.as_view(), name="api-list-tournament"),
    path('create/', views.CreateTournament.as_view(), name="api-create-tournament"),
    path('<int:id>/', views.RetrieveTournament.as_view(), name="api-retrieve-tournament"),
    path('register/', views.register_tournament, name="api-register-tournament"),
    path('unregister/', views.unregister_tournament, name="api-register-tournament"),
    path('schema/<int:tournament_id>/', views.get_tournament, name="api-get-tournament"),
    path('matches/', views.get_tournament_matches, name="api-get-tournament-matches"),
    path('check/tournaments/', views.check_tournaments, name="api-check-tournaments"),
]
