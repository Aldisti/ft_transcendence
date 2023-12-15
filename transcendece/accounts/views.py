from rest_framework_simplejwt.views import TokenViewBase
from django.http import HttpResponse, HttpResponseNotFound, HttpRequest
from accounts.serializers import UserSerializer
from django.views.decorators.csrf import csrf_exempt


# Create your views here.

@csrf_exempt
def login(request: HttpRequest) -> HttpResponse:
    print(request)
    serializer = UserSerializer(data=request)
    if serializer.is_valid():
        response = TokenViewBase.as_view()(request)
        print(response)
        return HttpResponse(response, status=200)
    return HttpResponse("error", status=400)
