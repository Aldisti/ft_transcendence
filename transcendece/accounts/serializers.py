from accounts.models import User, UserInfo
from rest_framework import serializers
from django.core import validators


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
            "username": {
                "validators": [validators.RegexValidator(regex="^[A-Za-z0-9!?*$~_-]{5,32}$")],
            },
            "email": {
                "required": False,
                "validators": [validators.EmailValidator()],
            },
        }


class CompleteUserSerializer(serializers.Serializer):
    credentials = UserSerializer()
    info = UserInfoSerializer(required=False)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data.get("credentials"))
        user.user_info = UserInfo.objects.create(user, **validated_data.get("info", {}))
        return user

