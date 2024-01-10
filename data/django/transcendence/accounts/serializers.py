from django.core.validators import RegexValidator, EmailValidator

from rest_framework import serializers

from accounts.models import User, UserInfo
from two_factor_auth.models import UserTFA
from accounts.validators import image_validator
from django.core.validators import RegexValidator, EmailValidator
from django.core.files.storage import default_storage
import logging

logger = logging.getLogger(__name__)


class UploadImageSerializer(serializers.Serializer):
    image = serializers.FileField(max_length=50, validators=[image_validator])

    def save_image(self, user, validated_data):
        image = validated_data["image"]
        #user_info = UserInfo.objects.get(pk=user)
        user_info = user.user_info
        user_info = UserInfo.objects.update_picture(user_info, picture=image)
        return user_info


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ["first_name", "last_name", "birthdate", "picture", "date_joined"]
        read_only_fields = ["date_joined", "picture"]


class UserSerializer(serializers.ModelSerializer):

    new_password = serializers.CharField(max_length=128, required=False, write_only=True)


    class Meta:
        model = User
        fields = ["username", "email", "password", "new_password", "active", "verified"]
        extra_kwargs = {
            "password": {"write_only": True, "required": False},
            "username": {"validators": [RegexValidator("^[A-Za-z0-9!?*$~_-]{5,32}$")]},
            "email": {"required": False, "validators": [EmailValidator()]},
            "active": {"read_only": True, "required": False},
            "verified": {"read_only": True, "required": False}
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
    banned = serializers.BooleanField(required=False)


    class Meta:
        model = User
        fields = ["username", "email", "password", "new_password", "role", "active", "verified", "banned", "user_info"]
        extra_kwargs = {
            "password": {"write_only": True, "required": False},
            "username": {"validators": [RegexValidator("^[A-Za-z0-9!?*$~_-]{5,32}$")]},
            "email": {"required": False, "validators": [EmailValidator()]},
            "role": {"write_only": True, "required": False},
            "active": {"read_only": True, "required": False},
            "verified": {"read_only": True, "required": False}
        }

    def create(self, validated_data):
        validated_data.pop("role", "")
        user_info = validated_data.pop("user_info", {})
        user = User.objects.create_user(**validated_data)
        user.user_info = UserInfo.objects.create(user, **user_info)
        user.user_tfa = UserTFA.objects.create(user=user)
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


    def update_role(self, validated_data):
        user_role = validated_data.pop("role", "")
        username = validated_data.pop("username")
        user = User.objects.get(pk=username)
        updated_user = User.objects.update_user_role(user, user_role)
        return updated_user

    def update_active(self, validated_data):
        username = validated_data.pop("username")
        banned = validated_data.pop("banned", True)
        user = User.objects.get(pk=username)
        updated_user = User.objects.update_user_active(user, banned)
        return updated_user

#    def update_image(self, validated_data):
