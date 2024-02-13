from django.urls import path, include
from tournaments import views

urlpatterns = [
    path('tournaments/', views.ListTournament.as_view(), name="api-list-tournament"),
    path('tournaments/create/', views.CreateTournament.as_view(), name="api-create-tournament"),
    path('tournaments/<int:id>/', views.RetrieveTournament.as_view(), name="api-retrieve-tournament"),
    path('tournaments/register/', views.register_tournament, name="api-register-tournament"),
]
