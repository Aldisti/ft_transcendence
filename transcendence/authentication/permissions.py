from rest_framework.permissions import BasePermission

from accounts.utils import Roles


# Create your custom permissions
# https://www.django-rest-framework.org/api-guide/permissions/#custom-permissions


class IsRole(BasePermission):
    roles = []

    # checks if the user role is present in 'roles'
    def has_permission(self, request, view) -> bool:
        if request.auth is None or request.user is None:
            return False
        return request.user.role in self.roles


class IsUser(IsRole):
    message = "You are not authenticated"
    roles = [Roles.USER, Roles.MOD, Roles.ADMIN]


class IsModerator(IsRole):
    roles = [Roles.MOD, Roles.ADMIN]


class IsAdmin(IsRole):
    roles = [Roles.ADMIN]
