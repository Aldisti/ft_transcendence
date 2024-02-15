from django.urls import path, include
from tournaments import views

urlpatterns = [
    path('tournaments/', views.ListTournament.as_view(), name="api-list-tournament"),
    path('tournaments/create/', views.CreateTournament.as_view(), name="api-create-tournament"),
    path('tournaments/<int:id>/', views.RetrieveTournament.as_view(), name="api-retrieve-tournament"),
    path('tournaments/register/', views.register_tournament, name="api-register-tournament"),
    path('tournaments/unregister/', views.unregister_tournament, name="api-register-tournament"),
    path('tournaments/schema/<int:tournament_id>/', views.get_tournament, name="api-get-tournament"),
]
