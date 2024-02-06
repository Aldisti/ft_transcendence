from uuid import UUID, uuid4

from pyotp import TOTP

from accounts.models import User
from authentication.models import UserTokens
from django.conf import settings
from django.urls import reverse
from django.template import loader

from two_factor_auth.models import UserTFA

from transcendence.producers import EmailProducer

import json
import logging

logger = logging.getLogger(__name__)


def send_verification_email(user: User):
    # generate token
    try:
        user_tokens = UserTokens.objects.get(pk=user.username)
    except UserTokens.DoesNotExist:
        user_tokens = UserTokens.objects.create(user)
    user_tokens = UserTokens.objects.generate_email_token(user_tokens)

    # generate url
    # url = reverse("api-email_verification") + "?token=" + user_tokens.email_token
    url = "http://localhost:8000/tokens/email/" + "?token=" + user_tokens.email_token

    # generate message
    title = "Registration to Transcendence"
    head = f"Dear {user.username},\n thank you for joining our community.\n"
    body = head + "In order to complete the registration process click the following link:"
    company = "Trinity"

    # email_message = generate_email(title, body, url, company)
    template = loader.get_template('email.html')
    context = {
        "title": title,
        "body": body,
        "link": url,
        "company": company,
    }
    email_message = template.render(context)

    # send email
    body = {"subject": "Registration", "receiver_mail": user.email, "text": "", "html": email_message}
    EmailProducer().publish(json.dumps(body))


def send_password_email(user: User):
    # generate token
    try:
        user_tokens = UserTokens.objects.get(pk=user.username)
    except UserTokens.DoesNotExist:
        user_tokens = UserTokens.objects.create(user)
    user_tokens = UserTokens.objects.generate_password_token(user_tokens)

    # generate url
    # url = reverse("api-password_recovery") + "?token=" + user_tokens.password_token
    # TODO: mettersi d'accordo con Marco sulla pagina per il password recovery
    # url = "http://localhost:8000/tokens/password/" + "?token=" + user_tokens.password_token
    url = "http://localhost:4200/password/recovery/" + "?token=" + user_tokens.password_token

    # generate message
    title = "Password recovery"
    head = f"Dear {user.username},\napparently you've forgotten your password, ignore this message otherwise.\n"
    body = head + "Click the following link to reset your password:"
    company = "Trinity"

    # email_message = generate_email(title, body, url, company)
    template = loader.get_template("email.html")
    context = {
        "title": title,
        "body": body,
        "link": url,
        "company": company,
    }
    email_message = template.render(context)

    # send mail
    body = {"subject": "Password recovery", "receiver_mail": user.email, "text": "", "html": email_message}
    EmailProducer().publish(json.dumps(body))


def send_tfa_code_email(user_tfa: UserTFA) -> None:
    # generate message
    title = "OTP code"
    head = f"Dear {user_tfa.user.username},\nthis is your otp code\n"
    body = head + "Please insert it in 5 minutes"
    code = TOTP(user_tfa.otp_token, interval=180).now()
    company = "Trinity"

    # email_message = generate_email(title, body, url, company)
    template = loader.get_template("otp_email.html")
    context = {
        "title": title,
        "body": body,
        "code": code,
        "company": company,
    }
    email_message = template.render(context)

    # send mail
    body = {"subject": "OTP code", "receiver_mail": user_tfa.user.email, "text": "", "html": email_message}
    EmailProducer().publish(json.dumps(body))
