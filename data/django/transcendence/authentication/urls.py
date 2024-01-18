from django.urls import path, include

from authentication import views


urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('refresh/', views.RefreshView.as_view(), name='refresh'),
    path('logout/', include([
        path('', views.logout, name='logout'),
        path('all/', views.logout, name='logout_all'),
    ])),
    path('ticket/', views.generate_ticket, name='api-generate-ticket')
    # path('test/', views.test),
    # path('test/v2/', views.test),
]
