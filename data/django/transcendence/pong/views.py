from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes

from base64 import b64decode
from json import loads


@api_view(['GET', 'POST'])
@permission_classes([])
def matchmaking(request):
    payload = request.COOKIES.get('refresh_token').split('.')[1]
    payload += '=' * (-len(payload) % 4)
    username = loads(b64decode(payload))['username']
    return render(request, 'matchmaking.html', context={'username': username})
