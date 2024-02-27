from django.conf import settings
from requests import get
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response

from transcendence.permissions import IsUser
from transcendence.throttles import HighLoadThrottle


def get_request(*args, **kwargs):
    return get(*args, **kwargs, verify=False)


@api_view(["GET"])
@permission_classes([IsUser])
@throttle_classes([HighLoadThrottle])
def get_messages(request):
    user = request.user
    url = settings.MS_URLS["MESSAGES_GET"] + f"?username={user.username}"
    api_response = get_request(url)
    return Response(api_response.json(), status=api_response.status_code)
