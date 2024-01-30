from django.urls import path, include

from authentication import views


urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('refresh/', views.RefreshView.as_view(), name='refresh'),
    path('logout/', include([
        path('', views.logout, name='logout'),
        path('all/', views.logout, name='logout_all'),
    ])),
    path('ticket/', include([
        path('', views.generate_ticket, name='api-generate-ticket'),
        path('matchmaking/', views.get_queue_ticket, name='api-generate-matchmaking-ticket'),
    ])),
    # path('test/', views.test),
]