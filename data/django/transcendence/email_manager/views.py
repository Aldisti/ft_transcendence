from django.conf import settings

from rest_framework.decorators import api_view, permission_classes, APIView
from rest_framework.response import Response

from email_manager.email_sender import send_password_reset_email

from requests import post as post_request
from logging import getLogger


logger = getLogger(__name__)

