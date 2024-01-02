from django.urls import path

from authentication import views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('refresh/', views.RefreshView.as_view(), name='refresh'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('redirect', views.callback, name='redirect'),
    path('oauth/42/', views.get_url, name='test_api1'),
    # path('test/', views.test, name='test'),
]
