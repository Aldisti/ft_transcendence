from django.urls import path

from authentication import views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('refresh/', views.RefreshView.as_view(), name='refresh'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('redirect', views.redirect_view, name='redirect'),
    path('api1/', views.test_api1, name='test_api1'),
    path('home/', views.home, name='home')
]
