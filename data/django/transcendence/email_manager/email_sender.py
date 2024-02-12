from django.conf import settings
from django.template import loader

from transcendence.producers import EmailProducer

import json
import logging


logger = logging.getLogger(__name__)


def send_password_reset_email(username: str, email: str, token: str) -> None:
    if username == '' or email == '' or token == '':
        raise ValueError("missing username, email or token")
    body = (f"Dear {username},\n"
            f"apparently you've forgotten your password, ignore this message otherwise.\n"
            f"Click the following link to reset your password:")
    template = loader.get_template("email.html")
    context = {
        "title": "Registration",
        "body": body,
        "link": settings.MS_URLS['CLIENT_RESET_PAGE'] + f"?token={token}",
        "company": "Trinity",
    }
    email_message = template.render(context)
    body = {"subject": "Password recovery", "receiver_mail": email, "text": "", "html": email_message}
    EmailProducer().publish(json.dumps(body))


def send_verify_email(username: str, email: str, token: str) -> None:
    if username == '' or email == '' or token == '':
        raise ValueError("missing username, email or token")
    body = (f"Dear {username},\n thank you for joining our community.\n"
            f"In order to complete the registration process click the following link:")
    template = loader.get_template("email.html")
    context = {
        "title": "Password recovery",
        "body": body,
        "link": settings.MS_URLS['CLIENT_LOGIN_PAGE'] + f"?token={token}",
        "company": "Trinity",
    }
    email_message = template.render(context)
    body = {"subject": "Verify email", "receiver_mail": email, "text": "", "html": email_message}
    EmailProducer().publish(json.dumps(body))


def send_tfa_code_email(username: str, email: str, code: str) -> None:
    # generate message
    title = "OTP code"
    body = f"Dear {username},\nthis is your otp code\nPlease insert it in 5 minutes"
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
    body = {"subject": "OTP code", "receiver_mail": email, "text": "", "html": email_message}
    EmailProducer().publish(json.dumps(body))
