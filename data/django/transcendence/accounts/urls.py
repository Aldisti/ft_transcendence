from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from accounts import views

urlpatterns = [
    path('register/', views.registration, name="api-register"),
    path('users/check/', views.check_user, name="api-check"),
    path('users/image/upload/', views.upload_profile_picture, name="api-upload-picture"),
    path('users/info/update/', views.update_user_info, name="api-update-info"),
    path('users/password/update/', views.update_password, name="api-update-password"),
    path('users/role/', views.change_role, name="api-change-role"),
    path('users/ban/', views.change_active, name="api-change-active"),
    path('users/', views.ListUser.as_view(), name="user-list"),
    path('users/<username>/', views.RetrieveDestroyUser.as_view(), name="user-retrieve-destroy"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
