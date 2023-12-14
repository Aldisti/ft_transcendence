from rest_framework import serializers
from accounts.models import User, UserInfo
from django.core.validators import RegexValidator, EmailValidator


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ["first_name", "last_name", "birthdate", "picture", "date_joined"]
        read_only_fields = ["date_joined", "picture"]


class UserSerializer(serializers.ModelSerializer):

    new_password = serializers.CharField(max_length=128, required=False, write_only=True)


    class Meta:
        model = User
        fields = ["username", "email", "password", "new_password"]
        extra_kwargs = {
            "password": {"write_only": True, "required": False},
            "username": {"validators": [RegexValidator("^[A-Za-z0-9!?*$~_-]{5,32}$")]},
            "email": {"required": False, "validators": [EmailValidator()]},
        }


class CustomUserSerializer(serializers.Serializer):
    username = serializers.CharField(validators=[RegexValidator("^[A-Za-z0-9!?*$~_-]{5,32}$")])
    email = serializers.EmailField(required=False, validators=[EmailValidator()])
    password = serializers.CharField(max_length=128, required=False, write_only=True)
    new_password = serializers.CharField(max_length=128, required=False, write_only=True)


class CompleteUserSerializer(serializers.Serializer):
    credentials = UserSerializer()
    info = UserInfoSerializer(required=False)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data.get("credentials"))
        user.user_info = UserInfo.objects.create(user, **validated_data.get("info", {}))
        return user

    def update_email(self, validated_data):
        user = User.objects.get(pk=validated_data.get("credentials").get("username"))
        updated_user = User.objects.update_user_email(user, **validated_data.get("credentials"))
        return updated_user

    def update_password(self, validated_data):
        user = User.objects.get(pk=validated_data.get("credentials").get("username"))
        updated_user = User.objects.update_user_password(user, **validated_data.get("credentials"))
        return updated_user

    def update_user_info(self, validated_data):
        try:
            user_info = UserInfo.objects.get(pk=validated_data.get("credentials").get("username"))
            updated_user_info = UserInfo.objects.update_info(user_info, **validated_data.get("info", {}))
        except UserInfo.DoesNotExist:
            user = User.objects.get(pk=validated_data.get("credentials").get("username"))
            updated_user_info = UserInfo.objects.create(user, **validated_data.get("info", {}))
        return updated_user_info
