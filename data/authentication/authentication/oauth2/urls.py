
from django.urls import path, include

from . import views


urlpatterns = [
    path('intra/', include([
        path('url/', views.get_intra_url, name='get_intra_url'),
        path('callback/<str:req_type>/', views.intra_callback, name='get_intra_token'),
        path('login/', views.intra_login, name='intra_login'),
        path('link/', views.IntraLink.as_view(), name='intra_link'),
        path('disable/', views.IntraLink.as_view(), name='intra_disable'),
    ])),
    path('google/', include([
        path('v2/', include([
            path('url/', views.get_google_url, name='get_google_url'),
            path('link/', views.GoogleLink.as_view(), name='google_link'),
            path('login/', views.google_login, name='google_login'),
        ])),
        path('unlink/', views.GoogleLink.as_view(), name='unlink_google'),
    ])),
]
