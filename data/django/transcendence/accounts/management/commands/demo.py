
from django.core.management.base import BaseCommand
from django.conf import settings
from django.urls import reverse
from rest_framework.response import Response

from rest_framework.test import APIRequestFactory

from accounts.serializers import CompleteUserSerializer
from accounts.views import create_user

from requests import post, delete
from random import randint
from datetime import date
from hashlib import sha256
import names


def generate_user_info(i: int, test: bool) -> dict[str, str]:
    first_name = names.get_first_name()
    last_name = names.get_last_name()
    username = f"tester{i}" if test else first_name + last_name
    password = sha256('password'.encode()).hexdigest()
    email = username + '@localhost.it'
    birthdate = date.today().replace(year=randint(1980, 2006), month=randint(1, 12), day=randint(1, 28))
    return {
        'first_name': first_name,
        'last_name': last_name,
        'username': username,
        'password': password,
        'email': email,
        'birthdate': birthdate,
    }


class Command(BaseCommand):
    help = 'Creates a defined number of users in the app'

    def add_arguments(self, parser):
        parser.add_argument('-c', '--count', type=int, default=10,
                            help='Number of users to create')
        parser.add_argument('-t', '--test', action='store_true',
                            help='Creates users with usernames like tester0, tester1, tester2')

    def handle(self, *args, **options):
        n = 0
        for i in range(options['count']):
            data = generate_user_info(i, options['test'])
            a, b = create_user(data)
            if a is None or b is None:
                continue
            self.stdout.write(f"{data['username']}")
            n += 1
        self.stdout.write(f"{n} users created")
