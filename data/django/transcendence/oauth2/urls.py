from django.urls import path, include

from oauth2 import views


urlpatterns = [
    path('linked/', views.is_user_linked, name='is_user_linked'),
    path('intra/', include([
        path('url/', views.get_intra_url, name='get_intra_url'),
        path('callback/<str:req_type>/', views.IntraCallback.as_view(), name='get_intra_token'),
        path('login/', views.intra_login, name='intra_login'),
        path('link/', views.IntraLink.as_view(), name='intra_link'),
        path('disable/', views.IntraLink.as_view(), name='intra_disable'),
    ])),
    path('google/', include([
        path('url/', views.get_google_url, name='get_google_url'),
        path('unlink/', views.unlink_google, name='unlink_google'),
        path('callback/', include([
            path('link/', views.google_link_callback, name='google_link_callback'),
            path('login/', views.google_login_callback, name='google_login_callback'),
        ])),
    ])),
]
