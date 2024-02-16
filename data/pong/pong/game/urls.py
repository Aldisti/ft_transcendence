from django.urls import path
from game import views

urlpatterns = [
    path('matches/', views.get_matches, name="api-get-matches")
]
