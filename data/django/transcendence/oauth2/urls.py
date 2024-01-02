from django.urls import path

from oauth2 import views

urlpatterns = [
    path('42/url/', views.get_url),
    path('42/callback', views.callback),
]
