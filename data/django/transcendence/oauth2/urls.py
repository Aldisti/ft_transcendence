from django.urls import path

from oauth2 import views

urlpatterns = [
    path('intra/url/', views.get_intra_url),
    path('intra/callback/', views.intra_callback),
    path('intra/login/', views.intra_login),
    path('intra/link/', views.intra_link),
]
