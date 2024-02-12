
from django.urls import path, include

from . import views


urlpatterns = [
    path('login/', views.login, name='api-login'),
    path('logout/', include([
        path('', views.logout, name='api-logout-current-device'),
        path('all/', views.logout, name='api-logout-all-devices'),
    ])),
    path('refresh/', views.refresh, name='api-refresh-token'),
    path('retrieve/public-key/', views.retrieve_pubkey, name='api-retrieve-public-key'),
    path('password/', include([
        path('recovery/', views.password_recovery, name='api-password'),
        path('reset/', views.password_reset, name='api-password-reset'),
    ])),
]
