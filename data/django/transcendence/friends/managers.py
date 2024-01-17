from django.db import models
from django.db.models import Q
from uuid import uuid4


def swap_users(function):
    def wrapper(self, user_1, user_2, **kwargs):
        if user_1.username > user_2.username:
            user_1, user_2 = user_2, user_1
        return function(self, user_1, user_2, **kwargs)
    
    return wrapper


class FriendsListManager(models.Manager):
    @swap_users
    def create(self, user_1, user_2, **kwargs):
        kwargs.setdefault("sender", "")
        token = uuid4()
        friends = self.model(user_1=user_1, user_2=user_2, token=token, **kwargs)
        friends.full_clean()
        friends.save()
        return friends

    @swap_users
    def are_friends(self, user_1, user_2) -> bool:
        friends = super().get_queryset().filter(user_1=user_1, user_2=user_2)
        if friends and friends[0].token == "":
            return True
        return False

    @swap_users
    def will_be_friends(self, user_1, user_2) -> bool:
        friends = super().get_queryset().filter(user_1=user_1, user_2=user_2)
        if friends and friends[0].token != "":
            return True
        return False

    @swap_users
    def delete(self, user_1, user_2):
        try:
            friends = super().get_queryset().get(user_1=user_1, user_2=user_2)
        except self.model.DoesNotExist:
            raise ValueError("This relationship does not exist")
        friends.delete()

    def clear_token(self, friends):
        friends.token = ""
        friends.sender = ""
        friends.full_clean()
        friends.save()
        return friends

    @swap_users
    def accept_friends_req(self, user_1, user_2):
        try:
            friends = super().get_queryset().get(user_1=user_1, user_2=user_2)
        except self.model.DoesNotExist:
            raise ValueError("Cannot accept if request doesn't exist")
        return self.clear_token(friends)

    @swap_users
    def get_friends(self, user_1, user_2):
        try:
            friends = super().get_queryset().get(user_1=user_1, user_2=user_2)
        except self.model.DoesNotExist:
            return None
        return friends

    def get_friends_by_token(self, token):
        try:
            friends = super().get_queryset().get(token=token)
        except self.model.DoesNotExist:
            return None
        return friends

    def get_all_friends(self, user):
        friends_list = super().get_queryset().filter((Q(user_1=user) | Q(user_2=user)) & Q(token=""))
        friends = [friend.user_1 if user == user_1 else friend.user_2 for friend in friends_list]
        return friends
