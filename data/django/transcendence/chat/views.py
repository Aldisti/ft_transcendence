from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from django.conf import settings

from transcendence.permissions import IsUser

from accounts.models import User

from requests import get as get_request


@api_view(["GET"])
@permission_classes([IsUser])
def get_messages(request):
    user = request.user
    url = settings.MS_URLS["MESSAGES_GET"] + f"?username={user.username}"
    api_response = get_request(url)
    return Response(api_response.json(), status=api_response.status_code)
