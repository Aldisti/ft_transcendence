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


class RegisterUserSerializer(serializers.Serializer):
    username = serializers.CharField(validators=[RegexValidator("^[A-Za-z0-9!?*$~_-]{5,32}$")])
    email = serializers.EmailField(required=False, validators=[EmailValidator()])
    password = serializers.CharField(max_length=128, required=False, write_only=True)
    new_password = serializers.CharField(max_length=128, required=False, write_only=True)
    user_info = UserInfoSerializer(required=False)


class CompleteUserSerializer(serializers.ModelSerializer):
    user_info = UserInfoSerializer(required=False)
    new_password = serializers.CharField(max_length=128, required=False, write_only=True)


    class Meta:
        model = User
        fields = ["username", "email", "password", "new_password", "user_info", "role"]
        extra_kwargs = {
            "password": {"write_only": True, "required": False},
            "username": {"validators": [RegexValidator("^[A-Za-z0-9!?*$~_-]{5,32}$")]},
            "email": {"required": False, "validators": [EmailValidator()]},
            "role": {"write_only": True, "required": False}
        }

    def create(self, validated_data):
        user_info = validated_data.pop("user_info", {})
        user = User.objects.create_user(**validated_data)
        user.user_info = UserInfo.objects.create(user, **user_info)
        return user

    def update_email(self, validated_data):
        validated_data.pop("user_info", {})
        user = User.objects.get(pk=validated_data.get("username"))
        updated_user = User.objects.update_user_email(user, **validated_data)
        return updated_user

    def update_password(self, validated_data):
        validated_data.pop("user_info", {})
        user = User.objects.get(pk=validated_data.get("username"))
        updated_user = User.objects.update_user_password(user, **validated_data)
        return updated_user

    def update_user_info(self, validated_data):
        user_info_dic = validated_data.pop("user_info", {})
        username = validated_data.get("username")
        try:
            user_info = UserInfo.objects.get(pk=username)
            updated_user_info = UserInfo.objects.update_info(user_info, **user_info_dic)
        except UserInfo.DoesNotExist:
            user = User.objects.get(pk=username)
            updated_user_info = UserInfo.objects.create(user, **user_info_dic)
        return updated_user_info
