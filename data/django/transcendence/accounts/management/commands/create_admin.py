
from django.core.management.base import BaseCommand

from accounts.models import User, UserInfo
from accounts.serializers import CompleteUserSerializer

from os import environ


class Command(BaseCommand):
    help = 'Create admin user'

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        username = environ.get('ADMIN_USERNAME')
        email = environ.get('ADMIN_EMAIL')
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            user = User.objects.create_superuser(username=username, email=email)
            UserInfo.objects.create(user=user)
