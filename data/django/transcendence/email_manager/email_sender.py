from uuid import UUID, uuid4
from accounts.models import User
from email_manager.models import UserTokens
from email_manager.email_template import generate_email
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse

def send_verification_email(user: User):
    # generate token
    try:
        user_tokens = UserTokens.objects.get(pk=user.username)
    except UserTokens.DoesNotExist:
        user_tokens = UserTokens.objects.create(user)
    user_tokens = UserTokens.objects.generate_email_token(user_tokens)

    # generate url
    #url = reverse("api-email_verification") + "?token=" + user_tokens.email_token
    url = "http://localhost:8000/verification/email/" + "?token=" + user_tokens.email_token

    # generate message
    title = "Registration to Transcendence"
    head = f"Dear {user.username}, thank you for joining our community,\n"
    body = head + "In order to complete the registration process click the following button"
    company = "Trinity"
    
    email_message = generate_email(title, body, url, company)

    # send mail
    send_mail(
            subject="Registration",
            message = "",
            html_message=email_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email]
            )
