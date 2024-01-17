from chat.models import Chat, ChatMember
from friends.models import FriendsList


def create_chat_entities(friends: FriendsList) -> FriendsList:
    user_1 = friends.user_1
    user_2 = friends.user_2
    chat = Chat.objects.create(chat_name=f"{user_1.username}_{user_2.username}")
    ChatMember.objects.create(chat=chat, user=user_1.user_websockets)
    ChatMember.objects.create(chat=chat, user=user_2.user_websockets)
    return friends

# when deletes the chat all messages linked to that chat will be removed
def delete_chat_entities(friends: FriendsList) -> FriendsList:
    user_1 = friends.user_1
    user_2 = friends.user_2
    chat = Chat.objects.filter(chat_member__user_id=user_1.username).filter(chat_member__user_id=user_2.username)
    chat.delete()
