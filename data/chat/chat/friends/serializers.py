from rest_framework import serializers

from users.models import UserWebsockets

class FriendsSerializer(serializers.ModelSerializer):
    status = serializers.BooleanField(source='get_status', read_only=True)
    picture = serializers.FileField(source='get_picture', max_length=100, read_only=True)

    class Meta:
        model = UserWebsockets
        fields = ["username", "status", "picture"]
        extra_kwargs = {
            "username": {"read_only": True},
        }
