from rest_framework import serializers
from accounts.models import User


class FriendsSerializer(serializers.ModelSerializer):
    picture = serializers.FileField(source='get_picture', max_length=100, read_only=True)

    class Meta:
        model = User
        fields = ["username", "picture"]
        extra_kwargs = {
            "username": {"read_only": True},
        }
