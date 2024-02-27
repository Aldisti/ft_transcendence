from django.urls import path

from messages import views

urlpatterns =[
    path("messages/", views.get_all_messages, name="get-all-messages"),
]
