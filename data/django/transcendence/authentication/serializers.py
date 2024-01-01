from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from authentication.utils import generate_token


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['csrf'] = generate_token(24)
        return token
