from rest_framework.permissions import BasePermission, IsAuthenticated

from accounts.utils import Roles

# logger
import logging

logger = logging.getLogger(__name__)


# Create your custom permissions
# https://www.django-rest-framework.org/api-guide/permissions/#custom-permissions


class IsRole(BasePermission):
    message = "user is not authenticated"
    roles = []

    # checks if the user role is present in 'roles'
    def has_permission(self, request, view) -> bool:
        user = request.user
        if not user.is_authenticated:
            return False
        return user.role in self.roles


class IsActualUser(IsAuthenticated):
    def has_permission(self, request, view):
        username = (request.query_params.get('username', '')
                    or request.data.get('username', '')
                    or request.path.strip('/').split('/')[-1])
        if super().has_permission(request, view):
            return username == request.user.username
        return False


class IsUser(IsRole):
    roles = [Roles.USER, Roles.MOD, Roles.ADMIN]


class IsModerator(IsRole):
    message = "user is not moderator"
    roles = [Roles.MOD, Roles.ADMIN]


class IsAdmin(IsRole):
    message = "user is not admin"
    roles = [Roles.ADMIN]
