from django.core import validators

from rest_framework import serializers

from users.models import PongUser

import logging

logger = logging.getLogger(__name__)

class PongUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PongUser
        fields = ["username"]
        extra_kwargs = {
            "username": {"validators": [validators.RegexValidator(regex="^[A-Za-z0-9!?*$~_-]{5,32}$")]}
        }
