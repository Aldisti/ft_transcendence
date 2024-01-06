from django.urls import path

from two_factor_auth import views

urlpatterns = [
    path('activate/', views.activate_tfa, name="activate"),
    path('disable/', views.disable_tfa, name="disable"),
    path('login/', views.login),
    path('validate/', views.validate_tfa),
]
