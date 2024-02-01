
from django.core.validators import RegexValidator, EmailValidator

from rest_framework import serializers

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User

from secrets import token_urlsafe


class UserSerializer(serializers.ModelSerializer):

    new_password = serializers.CharField(max_length=128, required=False, write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "new_password", "active", "verified", "tfa"]
        extra_kwargs = {
            "username": {"validators": [RegexValidator("^[A-Za-z0-9!?*$~_-]{5,32}$")]},
            "email": {"required": False, "validators": [EmailValidator()]},
            "password": {"write_only": True, "required": False},
            "active": {"required": False, "read_only": True},
            "verified": {"required": False, "read_only": True},
            "tfa": {"required": False, "read_only": True},
        }


class TokenPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['csrf'] = token_urlsafe(24)
        return token

