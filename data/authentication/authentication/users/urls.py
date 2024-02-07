from django.urls import path, include

from . import views


urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('update/', include([
        path('username/', views.update_username, name='update_username'),
        path('email/', views.update_email, name='update_email'),
        path('password/', views.update_password, name='update_password'),
        path('verified/', views.update_verified, name='update_verified'),
        path('role/', views.update_role, name='change_role'),
        path('active/', views.update_active, name='change_active'),
    ])),
    path('delete/<str:username>/', views.delete_user, name='delete_user'),
    path('info/<str:username>/', views.get_user, name='get_user'),
]
