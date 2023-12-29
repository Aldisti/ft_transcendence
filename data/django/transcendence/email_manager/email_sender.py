from uuid import UUID, uuid4
from email_manager.models import UserTokens
from email_manager.email_template import generate_email
from django.core.mail import send_mail
from django.conf import settings

def send_verification_mail(username: str, email: str):
    # generate uuid and url
    token = uuid4()
    url = "http://ipse.lorem.com/?token=" + str(token)

    # generate message
    title = "Registration to Transcendence"
    head = f"Dear {username}, thank you for joining our community,\n"
    body = head + "In order to complete the registration process click the following button"
    company = "Trinity"
    
    email_message = generate_email(title, body, url, company)

    # save uuid
    try:
        user_tokens = UserTokens.objects.get(pk=username)
    except UserTokens.DoesNotExist:
        user_tokens = UserTokens(username)
    user_tokens.email_token = str(token)
    user_tokens.full_clean()
    user_tokens.save()

    # send mail
    send_mail(
            subject="Registration",
            message = "",
            html_message=email_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email]
            )
