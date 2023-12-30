from rest_framework.permissions import BasePermission

from accounts.utils import Roles

# logger
import logging

logger = logging.getLogger(__name__)

# Create your custom permissions
# https://www.django-rest-framework.org/api-guide/permissions/#custom-permissions


class IsRole(BasePermission):
    roles = []

    # checks if the user role is present in 'roles'
    def has_permission(self, request, view) -> bool:
        user = request.user
        if request.auth is None or user is None:
            return False
        if not user.active:
            self.message = "This account has been banned"
            return False
        if not user.verified:
            self.message = "Account not yet verified"
            return False
        return user.role in self.roles


class IsActualUser(BasePermission):
    def has_permission(self, request, view) -> bool:
        user = request.user
        if request.auth is None or user is None:
            return False
        if not user.active:
            self.message = "This account has been banned"
            return False
        if not user.verified:
            self.message = "Account not yet verified"
            return False
        return user.username == view.kwargs['username']


class IsUser(IsRole):
    message = "You are not authenticated"
    roles = [Roles.USER, Roles.MOD, Roles.ADMIN]


class IsModerator(IsRole):
    roles = [Roles.MOD, Roles.ADMIN]


class IsAdmin(IsRole):
    roles = [Roles.ADMIN]
