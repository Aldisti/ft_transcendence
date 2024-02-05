from django.urls import path, include

from . import views


urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('unregister/', views.delete_user, name='unregister'),
    path('change/', include([
        path('role/', views.change_role, name='change_role'),
        path('active/', views.change_active, name='change_active'),
    ])),
    path('update/', include([
        path('username/', views.update_username, name='update_username'),
        path('email/', views.update_email, name='update_email'),
        path('password/', views.update_password, name='update_password'),
        path('verified/', views.update_verified, name='update_verified'),
    ])),
    path('delete/', views.delete_user, name='delete_user'),
    path('info/<str:username>/', views.get_user, name='get_user'),
]

