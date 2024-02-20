from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from accounts import views

urlpatterns = [
    path('test/', views.test, name="api-test"),
    path('register/', views.registration, name="api-register"),
    path('users/', include([
        path('', views.ListUser.as_view(), name="user-list"),
        path('check/', views.check_user, name="api-check"),
        path('image/upload/', views.upload_profile_picture, name="api-upload-picture"),
        path('info/update/', views.update_user_info, name="api-update-info"),
        path('password/update/', views.update_password, name="api-update-password"),
        path('role/', views.change_role, name="api-change-role"),
        path('ban/', views.change_active, name="api-change-active"),
        path('<username>/', views.RetrieveDestroyUser.as_view(), name="user-retrieve-destroy"),
        path('game/update/', views.change_display_name, name="api-change-display-name"),
        path('email/update/', views.update_email, name="api-update-email"),
    ])),
]

urlpatterns = format_suffix_patterns(urlpatterns)
