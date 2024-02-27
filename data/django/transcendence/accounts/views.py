import logging

from django.conf import settings
from django.core.exceptions import ValidationError
from requests import delete as delete_request
from requests import get as get_request
from requests import patch as patch_request
from requests import post as post_request
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.generics import RetrieveDestroyAPIView
from rest_framework.response import Response

from accounts.models import User, UserInfo, UserGame
from accounts.serializers import CompleteUserSerializer, UploadImageSerializer, UserInfoSerializer
from email_manager.email_sender import send_verify_email
from transcendence.decorators import get_func_credentials
from transcendence.permissions import IsAdmin, IsModerator, IsUser, IsActualUser
from transcendence.throttles import HighLoadThrottle, MediumLoadThrottle, LowLoadThrottle

logger = logging.getLogger(__name__)


def create_user(data) -> tuple[User, dict[str, str]] | tuple[None, None]:
    register_urls = settings.REGISTER_URLS
    delete_urls = settings.DELETE_URLS
    user_serializer = CompleteUserSerializer(data=data)
    user_serializer.is_valid(raise_exception=True)
    api_response = None
    for i, url in enumerate(register_urls):
        if 'auth' in url:
            api_response = post_request(url, data=data)
        else:
            api_response = post_request(url, data={'username': data['username']})
        if api_response.status_code < 300:
            continue
        # logger.warning(f"Error: {api_response.json()}")
        while i > 0:
            i -= 1
            delete_request(delete_urls[i].replace('<pk>', data['username']))
        return None, None
    user = user_serializer.create(user_serializer.validated_data)
    # logger.warning(f"user: {CompleteUserSerializer(user).data}")
    return user, api_response.json()


@api_view(['POST'])
@permission_classes([IsUser])
@throttle_classes([HighLoadThrottle])
def upload_profile_picture(request):
    user = request.user
    # logger.warning(f"data: {request.data}")
    # logger.warning(f"FILE: {request.FILES}")
    upload_image_serializer = UploadImageSerializer(data=request.data)
    if not upload_image_serializer.is_valid():
        return Response(status=400)
    upload_image_serializer.save_image(user, upload_image_serializer.validated_data)
    return Response({"message": "Profile picture uploaded"}, status=200)


@api_view(['POST'])
@permission_classes([])
@throttle_classes([HighLoadThrottle])
def registration(request):
    try:
        user, email_info = create_user(request.data)
    except ValidationError as e:
        return Response(data={'message': str(e)}, status=400)
    if user is None or email_info is None:
        return Response(data={'message': 'something went wrong'}, status=500)
    send_verify_email(**email_info)
    serializer_response = CompleteUserSerializer(user)
    return Response(serializer_response.data, status=201)


@api_view(['PATCH'])
@permission_classes([IsAdmin])
@throttle_classes([MediumLoadThrottle])
@get_func_credentials
def change_role(request):
    """
    Request: {"username": <username>, "role": <[U, M]>}
    """
    # auth server
    api_response = patch_request(
        settings.MS_URLS['AUTH']['UPDATE_ROLE'],
        headers=request.api_headers,
        json=request.data,
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    # main server
    user_serializer = CompleteUserSerializer(data=request.data)
    if not user_serializer.is_valid():
        return Response(status=400)
    user = user_serializer.update_role(user_serializer.validated_data)
    return Response({"username": user.username, "new_role": user.role}, status=200)


@api_view(['PATCH'])
@permission_classes([IsUser])
@throttle_classes([HighLoadThrottle])
@get_func_credentials
def update_password(request):
    """
    Request: {"password": <password>, "new_password"}
    """
    api_response = patch_request(
        settings.MS_URLS['AUTH']['UPDATE_PASSWORD'],
        headers=request.api_headers,
        json=request.data
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    data = api_response.json()
    response = Response(status=200)
    response.set_cookie(
        key='refresh_token',
        value=data.pop('refresh_token'),
        max_age=data.pop('exp'),
        secure=True,
        httponly=True,
        samesite='Lax',
    )
    response.data = data
    return response


@api_view(['PATCH'])
@permission_classes([IsModerator])
@throttle_classes([MediumLoadThrottle])
@get_func_credentials
def change_active(request):
    """
    Request: {"username": <username>, "banned": <[True, False]>}
    """
    api_response = patch_request(
        settings.MS_URLS['AUTH']['UPDATE_ACTIVE'],
        headers=request.api_headers,
        json=request.data,
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    return Response(status=200)


@api_view(['PUT'])
@permission_classes([IsUser])
@throttle_classes([LowLoadThrottle])
def update_user_info(request):
    """
    Request: {"first_name": <first_name>, etc...}
    """
    user_info_serializer = UserInfoSerializer(data=request.data)
    user_info_serializer.is_valid(raise_exception=True)
    user_info = request.user.user_info
    updated_user_info = UserInfo.objects.update_info(user_info, **user_info_serializer.validated_data)
    return Response(UserInfoSerializer(updated_user_info).data, status=200)


class RetrieveDestroyUser(RetrieveDestroyAPIView):
    permission_classes = [IsActualUser | IsAdmin]
    throttle_classes = [MediumLoadThrottle]
    queryset = User.objects.all()
    serializer_class = CompleteUserSerializer
    lookup_field = "username"

    def destroy(self, request, *args, **kwargs):
        # logger.warning("MY DESTROY")
        # logger.warning(f"KWARGS: {kwargs}")
        username = kwargs.get("username", "")
        if username != "":
            data = {'username': username}
            # delete from ntf db
            ntf_url = settings.MS_URLS['NTF_DELETE'].replace("<pk>", username)
            delete_request(ntf_url, json=data)
            # delete from chat db
            chat_url = settings.MS_URLS['CHAT_DELETE'].replace("<pk>", username)
            delete_request(chat_url, json=data)
            # delete from pong db
            pong_url = settings.MS_URLS['PONG_DELETE'].replace("<pk>", username)
            delete_request(pong_url, json=data)
            # delete from auth db
            headers = {'Authorization': request.headers.get('Authorization', '')}
            auth_url = settings.MS_URLS['AUTH']['DELETE'].replace("<pk>", username)
            delete_request(auth_url, headers=headers, json=request.data)
        return super().destroy(request, *args, **kwargs)


@api_view(['GET'])
@permission_classes([IsUser])
@throttle_classes([LowLoadThrottle])
def get_user_info(request):
    username = request.query_params.get("username", "")
    try:
        user = User.objects.get(pk=username)
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    serializer = CompleteUserSerializer(user)
    data = serializer.data
    picture = data["user_info"]["picture"]
    protocol = request.headers.get('X-Forwarded-Proto', '')
    if protocol == '':
        protocol = settings.PROTOCOL
    host = request.headers.get("Host")
    data["user_info"]["picture"] = None if picture is None else f"{protocol}://{host}{picture}"
    return Response(data, status=200)


@api_view(['GET'])
@permission_classes([])
def check_user(request):
    """
    http://<url>/?<username|email>=<username|mail>
    """
    if len(request.query_params) != 1:
        return Response({"message": "bad url formatting"}, status=400)
    username = request.query_params.get("username", "")
    email = request.query_params.get("email", "")
    found = User.objects.is_already_registered(username, email)
    return Response({"found": found}, status=200)


@api_view(['POST'])
def change_display_name(request) -> Response:
    display_name = request.data.get("display_name", "")
    if display_name == '':
        return Response({'message': 'invalid name'}, status=400)
    try:
        UserGame.objects.update_display_name(request.user.user_game, display_name)
    except ValidationError:
        return Response({'message': 'invalid name'}, status=400)
    return Response(status=200)


@api_view(['PATCH'])
@permission_classes([IsUser])
@throttle_classes([HighLoadThrottle])
@get_func_credentials
def update_email(request) -> Response:
    email = request.data.get("email", "")
    password = request.data.get("password", "")
    if email == '' or password == '':
        return Response(data={'message': 'missing email or password'}, status=400)
    api_response = patch_request(
        settings.MS_URLS['AUTH']['UPDATE_EMAIL'],
        headers=request.api_headers,
        data=request.data,
    )
    if api_response.status_code != 200 and api_response.status_code != 204:
        return Response(data=api_response.json(), status=api_response.status_code)
    User.objects.update_user_email(request.user, email=email)
    if api_response.status_code == 200:
        email_info = api_response.json()
        send_verify_email(**email_info)
    return Response(status=200)


@api_view(['GET'])
@permission_classes([IsModerator])
@throttle_classes([LowLoadThrottle])
@get_func_credentials
def list_users(request):
    query_params = "?" + "&".join([f"{key}={value}" for key, value in request.query_params.items()])
    api_response = get_request(
        settings.MS_URLS['AUTH']['LIST_USERS'] + query_params,
        headers=request.api_headers,
        json=request.data,
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)

    data = api_response.json()
    users_json = data.get("results", [])
    # logger.warning(data)
    protocol = request.headers.get('X-Forwarded-Proto', '')
    if protocol == '':
        protocol = settings.PROTOCOL
    host = request.headers.get("Host", "")
    for user_json in users_json:
        try:
            user = User.objects.get(user_json.get("username", ""))
            picture_url = f"{protocol}://{host}{user.get_picture().url}"
        except User.DoesNotExist:
            return Response({"message": "Databases desynchronized"}, status=500)
        except ValueError:
            picture_url = None
        user_json.setdefault("picture", picture_url)
    return Response(data, status=200)
