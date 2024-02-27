
from django.core.management.base import BaseCommand

from two_factor_auth.models import UserTFA
from users.models import User

from hashlib import sha256
from os import environ


class Command(BaseCommand):
    help = 'Create admin user'

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        username = environ.get('ADMIN_USERNAME')
        email = environ.get('ADMIN_EMAIL')
        password = sha256(environ.get('ADMIN_PASSWORD').encode()).hexdigest()
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            user = User.objects.create_superuser(username, email, password)
            UserTFA.objects.create(user)
