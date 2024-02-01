
from rest_framework.permissions import IsAuthenticated

from users.models import Roles


class IsActualUser(IsAuthenticated):
    def has_permission(self, request, view):
        username = request.query_params.get('username', '')
        if super().has_permission(request, view):
            return username == request.user.username
        return False


class IsAdmin(IsAuthenticated):
    def has_permission(self, request, view):
        if super().has_permission(request, view):
            return request.user.role == Roles.ADMIN
        return False
