from rest_framework import serializers

from django.conf import settings

class MessageSerializer(serializers.Serializer):
    sender = serializers.CharField(max_length=32, read_only=True)
    time = serializers.CharField(max_length=32, read_only=True)
    body = serializers.CharField(max_length=settings.MAX_MESSAGE_LENGTH, read_only=True)

    def get_data(self, message):
        json = {}
        json["sender"] = message.get_sender()
        json["sent_time"] = message.get_time()
        json["body"] = message.body
        return json
