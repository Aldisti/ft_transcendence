from datetime import date, timedelta
from django.test import TestCase
from accounts.serializers import UserSerializer, UserInfoSerializer, CompleteUserSerializer
from django.core.exceptions import ValidationError

class CompleteUserSerializerTests:
    def SetUpTestData(cls):
