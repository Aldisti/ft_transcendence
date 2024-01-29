from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from email_manager import views

urlpatterns = [
    path('email/', views.email_token_validation, name="api-email_verification"),
    path('password/', views.password_reset, name="api-password_reset"),
    path('recovery/', views.password_recovery, name="api-password_recovery"),
    path('otp/', views.SendOtpCodeView.as_view(), name='api-otp_code'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
