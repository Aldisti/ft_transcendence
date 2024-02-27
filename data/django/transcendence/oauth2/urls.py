from django.urls import path, include

from oauth2 import views


urlpatterns = [
    path('linked/', views.is_user_linked, name='is_user_linked'),
    path('intra/', include([
        path('url/', views.intra_get_url),
        path('login/', views.intra_login),
        path('link/', views.intra_link),
        path('unlink/', views.intra_unlink),
    ])),
    path('google/', include([
        path('v2/', include([
            path('url/', views.get_google_url, name='get_google_url'),
            path('login/', views.google_login, name='google_login'),
            path('link/', views.google_link, name='google_link'),
        ])),
        path('unlink/', views.unlink_google, name='unlink_google'),
    ])),
]
