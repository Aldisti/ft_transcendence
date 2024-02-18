from rest_framework.decorators import api_view
from rest_framework.response import Response

from users.models import UserWebsockets

from messages.models import ChatMember

@api_view(["GET"])
def get_all_messages(request):
    # get user from request
    try:
        username = request.query_params["username"]
        user = UserWebsockets.objects.get(username=username)
    except UserWebsockets.DoesNotExist:
        return Response({"message": "User not found"}, status=404)

    chat_members = ChatMember.objects.select_related("chat").filter(user=user)
    chats = [chat_member.chat for chat_member in chat_members]
    data = {"global": []}

    for chat in chats:
        other = chat.chat_member.exclude(user=user).first()
        data.setdefault(other.user_id, [])
        messages = chat.message.order_by("sent_time")
        for message in messages:
            data[other.user_id].append(message.to_json())

    return Response(data, status=200)
