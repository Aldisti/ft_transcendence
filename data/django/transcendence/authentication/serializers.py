from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import Token

from random import SystemRandom
from base64 import b64encode


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user) -> Token:
        token = super().get_token(user)
        token['role'] = user.role
        token['csrf'] = b64encode(SystemRandom().randbytes(24)).decode('utf-8')
        return token
