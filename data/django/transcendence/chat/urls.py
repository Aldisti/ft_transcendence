from django.urls import path

from chat import views

urlpatterns = [
    path("messages/", views.get_messages, name="api-get-messages")
]
