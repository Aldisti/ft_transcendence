from django.urls import path, include

from matchmaking import views


urlpatterns = [
    path('token/', views.generate_matchmaking_token, name='generate_matchmaking_token'),
    path('', views.start_queue),
    path('test/', views.test),
]
