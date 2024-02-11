"""
URL configuration for transcendence project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# TODO: delete this imports
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from requests import post as post_request
from rest_framework_simplejwt.tokens import RefreshToken

from transcendence.decorators import get_func_credentials
from logging import getLogger

logger = getLogger(__name__)


# TODO: delete this function
@api_view(['GET'])
@permission_classes([])
@get_func_credentials
def intra_callback(request) -> Response:
    logger.warning(f"we got here\n{request.api_headers}\n{request.api_cookies}")
    return Response(status=307, headers={
        'Location': 'http://localhost:8000/oauth2/intra/v2/login/?' +
        f"code={request.query_params.get('code')}&state={request.query_params.get('state')}"
    })
    # refresh_token = RefreshToken(request.api_cookies['refresh_token'])
    # request.api_headers = {'Authorization': f"Bearer {str(refresh_token.access_token)}"}
    code = request.query_params.get('code')
    state = request.query_params.get('state')
    if code == '' or state == '':
        return Response({'message': f"missing code: {code} or state: {state}"}, status=400)
    data = {'code': code, 'state': state}
    api_response = post_request(
        settings.MS_URLS['AUTH']['INTRA_LINK'],
        headers=request.api_headers,
        cookies=request.api_cookies,
        json=data,
    )
    if api_response.status_code != 200:
        return Response(data=api_response.json(), status=api_response.status_code)
    return Response(status=200)


urlpatterns = [
    path('', include('accounts.urls')),
    path('auth/', include('authentication.urls')),
    path('oauth2/', include('oauth2.urls')),
    path('2fa/', include('two_factor_auth.urls')),
    path('tokens/', include('email_manager.urls')),
    path('friends/', include('friends.urls')),
    path('pong/', include('pong.urls')),
    # TODO: delete this temporary path
    path('intra/callback/', intra_callback)
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
