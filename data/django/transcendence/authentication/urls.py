from django.urls import path

from authentication import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('refresh/', views.refresh_token, name='refresh'),
    path('logout/', views.logout, name='logout'),
]
