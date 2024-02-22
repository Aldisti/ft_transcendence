
from django.core.management.base import BaseCommand
from django.conf import settings
from django.urls import reverse
from rest_framework.response import Response

from rest_framework.test import APIRequestFactory, force_authenticate

from accounts.serializers import CompleteUserSerializer, UploadImageSerializer
from accounts.views import create_user, upload_profile_picture

from requests import get, post, delete
from random import randint
from datetime import date
from hashlib import sha256
from PIL import Image
from os import environ
import names
import io


IMAGE_NAME = 'image.jpg'
IMAGE_PATH = f"{IMAGE_NAME}"


def generate_user_info(i: int, test: bool) -> dict[str, str]:
    first_name = names.get_first_name()
    last_name = names.get_last_name()
    username = f"tester{i}" if test else first_name + last_name
    password = sha256('password'.encode()).hexdigest()
    email = username + '@localhost.it'
    birthdate = date.today().replace(year=randint(1980, 2006), month=randint(1, 12), day=randint(1, 28))
    return {
        'user_info': {
            'first_name': first_name,
            'last_name': last_name,
            'birthdate': birthdate,
        },
        'username': username,
        'password': password,
        'email': email,
    }


def get_image():
    try:
        res = get('https://picsum.photos/400')
    except:
        return False
    if res.status_code != 200:
        return False
    buffer = io.BytesIO()
    buffer.write(res.content)
    image = Image.open(buffer)
    image.save(IMAGE_NAME, format='JPEG')
    return True


class Command(BaseCommand):
    help = 'Creates a defined number of users in the app'

    def add_arguments(self, parser):
        parser.add_argument('-c', '--count', type=int, default=10,
                            help='Number of users to create')
        parser.add_argument('-t', '--test', action='store_true',
                            help='Creates users with usernames like tester0, tester1, tester2')

    def handle(self, *args, **options):
        factory = APIRequestFactory()
        request = factory.post(
            reverse('api-upload-picture'),
            {'image': open(IMAGE_NAME, 'rb')},
        )
        n = 0
        for i in range(options['count']):
            data = generate_user_info(i, options['test'])
            user, b = create_user(data)
            if user is None or b is None:
                continue
            if not get_image():
                self.stderr.write(f"image failed")
                continue
            force_authenticate(request, user=user)
            upload_profile_picture(request)
            self.stdout.write(f"{data['username']}")
            n += 1
        self.stdout.write(f"{n} users created")
