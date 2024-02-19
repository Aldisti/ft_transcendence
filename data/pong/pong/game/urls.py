from django.urls import path, include
from game import views

urlpatterns = [
    path('matches/', views.get_matches, name="api-get-matches"),
    path('match/', include([
        path('', views.send_match_request, name="api-send-match-request"),
        path('delete/', views.delete_match_request, name="api-delete-match-request"),
        path('accept/', views.accept_match_request, name="api-accept-match-request"),
        path('reject/', views.reject_match_request, name="api-reject-match-request"),
    ])),
]
