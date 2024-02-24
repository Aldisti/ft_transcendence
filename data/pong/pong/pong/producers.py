from django.conf import settings

import pika

class NotificationProducer:
    def __init__(self) -> None:
        # credentials used to connect to rabbitmq
        credentials = pika.PlainCredentials(settings.RABBIT['user'], settings.RABBIT['pass'])

        # params used to create a connection with rabbitMq
        params = pika.ConnectionParameters(
            host=settings.RABBIT['host'],
            port=settings.RABBIT['port'],
            credentials=credentials,
            #virtual_host=settings.RABBIT['VHOSTS']['ntf'],
            heartbeat=settings.RABBIT['heartbeat'],
            blocked_connection_timeout=settings.RABBIT['bc_timeout']
        )

        # create the connection
        self.connection = pika.BlockingConnection(params)
        self.channel = self.connection.channel()

    def publish(self, method, body):
        properties = pika.BasicProperties(content_type=method)
        self.channel.basic_publish(
            exchange=settings.RABBIT['exchange'],
            routing_key=settings.RABBIT['R_KEYS']['ntf'],
            properties=properties,
            body=body
        )
        self.channel.close()
