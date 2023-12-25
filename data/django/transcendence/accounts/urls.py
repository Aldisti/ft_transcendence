from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from accounts import views

urlpatterns = [
    path('register/', views.registration),
    path('users/role/', views.change_role),
    path('users/ban/', views.change_active),
    path('users/', views.ListUser.as_view()),
    path('users/<username>/', views.RetrieveDestroyUser.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
