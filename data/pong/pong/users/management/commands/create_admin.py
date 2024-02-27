
from django.core.management.base import BaseCommand

from users.models import PongUser

from os import environ


class Command(BaseCommand):
    help = 'Create admin user'

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        username = environ.get('ADMIN_USERNAME')
        try:
            PongUser.objects.get(username=username)
        except PongUser.DoesNotExist:
            PongUser.objects.create(username=username)
