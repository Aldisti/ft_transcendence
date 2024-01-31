from django.urls import path, include
from users import views


urlpatterns = [
    path('register/', views.CreateUser.as_view(), name="api-register"),
    path('<pk>/delete/', views.DeleteUser.as_view(), name="api-delete"),
    path('ticket/', views.generate_ticket, name="api-generate_ticket"),
]
