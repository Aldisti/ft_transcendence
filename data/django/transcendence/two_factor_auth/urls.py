from django.urls import path, include

from two_factor_auth import views

urlpatterns = [
    path('manage/', views.ManageView.as_view(), name='manage'),
    path('validate/', include([
        path('login/', views.validate_login, name='validate_login'),
        path('recover/', views.validate_recover, name='validate_recover'),
        path('activate/', views.validate_activate, name='validate_activate'),
    ])),
]
