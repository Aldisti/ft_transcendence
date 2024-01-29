from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from friends import views

urlpatterns = [
    path('request/', include([
        path('send/', views.make_friends_request, name="api-make-friends-request"),
        path('accept/', views.accept_friends_request, name="api-accept-friends-request"),
        path('reject/', views.reject_friends_request, name="api-reject-friends-request"),
        path('delete/', views.delete_friends, name="api-delete-friends-request"),
    ])),
    path('', views.are_friends, name="api-are-friends-request"),
    path('all/', views.get_all_friends, name="api-get-all-friends-request"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
