
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from users.models import User

from secrets import token_urlsafe


class TokenPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user: User):
        token = super().get_token(user)
        token['role'] = user.role
        token['csrf'] = token_urlsafe(24)
        return token
