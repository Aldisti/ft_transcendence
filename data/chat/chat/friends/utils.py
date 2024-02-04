from messages.models import Chat, ChatMember

from friends.models import FriendsList

from users.models import UserWebsockets


def create_chat_entities(friends: FriendsList) -> FriendsList:
    user_1 = friends.user_1
    user_2 = friends.user_2
    chat = Chat.objects.create(chat_name=f"{user_1.username}_{user_2.username}")
    ChatMember.objects.create(chat=chat, user=user_1)
    ChatMember.objects.create(chat=chat, user=user_2)
    return friends


# when deletes the chat all messages linked to that chat will be removed
def delete_chat_entities(friends: FriendsList) -> FriendsList:
    user_1 = friends.user_1
    user_2 = friends.user_2
    chat = Chat.objects.filter(chat_member__user_id=user_1.username).filter(chat_member__user_id=user_2.username)
    chat.delete()


def get_users_from_friends(friends: list, common_friend: UserWebsockets) -> list:
    users = []
    for friend in friends:
        user = friend.user_1
        if user == common_friend:
            user = friend.user_2
        users.append(user)
    return users
