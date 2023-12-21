from rest_framework.permissions import BasePermission

from accounts.utils import Roles


# Create your custom permissions
# https://www.django-rest-framework.org/api-guide/permissions/#custom-permissions


class IsRole(BasePermission):
    roles = []

    def has_permission(self, request, view):
        if request.auth is None or request.user is None:
            return False
        role = request.user.role
        if role is not None and role in self.roles:
            return True
        return False


class IsUser(IsRole):
    message = "You are not authenticated"
    roles = [Roles.USER, Roles.MOD, Roles.ADMIN]


class IsModerator(IsRole):
    roles = [Roles.MOD, Roles.ADMIN]


class IsAdmin(IsRole):
    roles = [Roles.ADMIN]
