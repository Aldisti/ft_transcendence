from django.urls import path, include

from authentication import views


urlpatterns = [
    path('login/', views.login, name='login'),
    path('refresh/', views.refresh, name='refresh'),
    path('logout/', include([
        path('', views.logout, name='logout'),
        path('all/', views.logout, name='logout_all'),
    ])),
    path('ticket/', include([
        path('ntf/', views.generate_ntf_ticket, name='api-generate-ntf-ticket'),
        path('chat/', views.generate_chat_ticket, name='api-generate-chat-ticket'),
        path('matchmaking/', views.get_queue_ticket, name='api-generate-matchmaking-ticket'),
    ])),
    path('retrieve/', include([
        path('public-key/', views.retrieve_pubkey, name='api-retrieve-public-key')
    ])),
    path('recovery/', views.password_recovery, name='api-recovery-password'),
    path('password/', views.password_reset, name='api-password-reset'),
    path('email/', views.email_token_validation, name='api-email-verification'),
    # path('test/', views.test),
]
