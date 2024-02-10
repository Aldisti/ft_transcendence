
from django.urls import path, include

from . import views


urlpatterns = [
    path('manage/', views.ManageView.as_view(), name='manage'),
    path('validate/', include([
        path('activate/', views.validate_activate, name='validate_activate'),
        path('login/', views.validate_login, name='validate_login'),
        path('recover/', views.validate_recover, name='validate_recover'),
    ])),
]
