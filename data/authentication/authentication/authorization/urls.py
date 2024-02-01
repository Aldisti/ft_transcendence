
from django.urls import path, include

from . import views


urlpatterns = [
    path('login/', views.login, name='api-login'),
    path('logout/', include([
        path('', views.logout, name='api-logout-current-device'),
        path('all/', views.logout, name='api-logout-all-devices'),
    ])),
    path('refresh/', views.refresh, name='api-refresh-token'),
]
