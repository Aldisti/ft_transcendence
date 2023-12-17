from rest_framework import serializers
from accounts.models import User, UserInfo


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ["first_name", "last_name", "birthdate", "picture", "date_joined"]
        read_only_fields = ["date_joined", "picture"]


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {
            "password": {
                "write_only": True,
                "required": False,
            },
        }


class CompleteUserSerializer(serializers.Serializer):
    credentials = UserSerializer()
    info = UserInfoSerializer(required=False)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data.get("credentials"))
        user.user_info = UserInfo.objects.create(user, **validated_data.get("info", {}))
        return user

#    def update(self, user, validated_data):

