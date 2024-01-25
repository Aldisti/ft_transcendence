from rest_framework import serializers
from users.models import PongUser

import logging

logger = logging.getLogger(__name__)

class PongUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PongUser
        fields = ["username", "ticket"]
        extra_kwargs = {
            "ticket": {"read_only": True},
        }

    def create(self, validated_data):
        username = validated_data.get("username", "")
        logger.warning(f"DATA: {validated_data}")
        if username == "":
            raise ValueError("Invalid username")
        pong_user = PongUser.objects.create(username)
        return pong_user
