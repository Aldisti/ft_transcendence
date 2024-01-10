from django.urls import path, include

from oauth2 import views

urlpatterns = [
    path('intra/', include([
        path('url/', views.IntraUrl.as_view(), name='get_intra_url'),
        path('callback/', views.IntraCallback.as_view(), name='get_intra_token'),
        path('login/', views.intra_login, name='intra_login'),
        path('link/', views.intra_link, name='intra_link'),
    ]))
]