from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from random import SystemRandom
from base64 import b64encode


SPRING = SystemRandom()


def generate_token() -> str:
    encoded = b64encode(SPRING.randbytes(24))
    return str(encoded, encoding='utf-8')


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['csrf'] = generate_token()
        return token
