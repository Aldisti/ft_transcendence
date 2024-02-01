
from django.core.validators import RegexValidator, EmailValidator

from rest_framework import serializers

from .models import User


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
