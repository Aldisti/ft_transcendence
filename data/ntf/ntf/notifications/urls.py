from django.urls import path, include
from notifications import views

urlpatterns = [
    path("group/", views.group_ntf, name="api-group_ntf"),
    path("friends_req/", views.friends_req_ntf, name="api-friends_req_ntf"),
    path("match_req/", views.match_req_ntf, name="api-match_req_ntf"),
    path("info/", views.info_ntf, name="api-info_ntf"),
    path("alert/", views.alert_ntf, name="api-alert_ntf"),
    path("ban/", views.ban_ntf, name="api-ban_ntf"),
]
