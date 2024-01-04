from django.urls import path

from oauth2 import views

urlpatterns = [
    path('intra/url/', views.IntraUrl.as_view(), name='get_intra_url'),
    path('intra/callback/', views.IntraCallback.as_view(), name='get_intra_token'),
    path('intra/login/', views.intra_login, name='intra_login'),
    path('intra/link/', views.intra_link, name='intra_link'),
]
