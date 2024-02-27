
from django.core.management.base import BaseCommand

from users.models import UserWebsockets

from os import environ


class Command(BaseCommand):
    help = 'Create admin user'

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        username = environ.get('ADMIN_USERNAME')
        try:
            UserWebsockets.objects.get(username=username)
        except UserWebsockets.DoesNotExist:
            UserWebsockets.objects.create(username=username)
