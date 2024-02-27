from django.conf import settings
from requests import get as get_request
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from transcendence.permissions import IsUser


@api_view(["GET"])
@permission_classes([IsUser])
def get_messages(request):
    user = request.user
    url = settings.MS_URLS["MESSAGES_GET"] + f"?username={user.username}"
    api_response = get_request(url)
    return Response(api_response.json(), status=api_response.status_code)
