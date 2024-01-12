from django.urls import path, include

from oauth2 import views


urlpatterns = [
    path('intra/', include([
        path('url/', views.IntraUrl.as_view(), name='get_intra_url'),
        path('callback/<str:req_type>/', views.IntraCallback.as_view(), name='get_intra_token'),
        path('login/', views.intra_login, name='intra_login'),
        path('link/', views.IntraLink.as_view(), name='intra_link'),
        path('disable/', views.IntraLink.as_view(), name='intra_disable'),
    ])),
    # path('google/', include([
    #     path('url/', views.GoogleUrl.as_view(), name='get_google_url'),
    #     path('callback/<str:req_type>/', views.GoogleCallback.as_view(), name='get_google_token'),
    #     path('login/', views.google_login, name='google_login'),
    #     path('link/', views.GoogleLink.as_view(), name='google_link'),
    #     path('disable/', views.GoogleLink.as_view(), name='google_disable'),
    # ])),
]
