
from django.urls import path, include

from . import views


urlpatterns = [
    path('intra/', include([
        path('v2/', include([
            path('url/', views.v2_intra_get_url),
            path('login/', views.v2_intra_login),
            path('link/', views.v2_intra_link),
        ])),
        path('unlink/', views.IntraLink.as_view(), name='intra_disable'),
    ])),
    path('google/', include([
        path('v2/', include([
            path('url/', views.get_google_url, name='get_google_url'),
            path('link/', views.GoogleLink.as_view(), name='google_link'),
            path('login/', views.google_login, name='google_login'),
        ])),
        path('unlink/', views.GoogleLink.as_view(), name='unlink_google'),
    ])),
    path('linked/', views.is_user_linked),
]
