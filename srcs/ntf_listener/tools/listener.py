import threading
import time
import sys
import pika
import os
import logging
import json
from requests import post as post_request

logger = logging.getLogger(__name__)

RABBIT_HOST = os.environ['RABBIT_HOST']
RABBIT_PORT = os.environ['RABBIT_PORT']
VHOST = os.environ['VHOST']
EXCHANGE = os.environ['EXCHANGE']
NTF_ROUTING_KEY = os.environ['NTF_ROUTING_KEY']
THREAD = os.environ['THREAD']
QUEUE_NAME = os.environ['QUEUE_NAME']


class MyThread(threading.Thread):
    def __init__(self, *args, **kwargs):
        super().__init__(group=None, *args, **kwargs)
        params = pika.ConnectionParameters(host=RABBIT_HOST, port=int(RABBIT_PORT))
        connection = pika.BlockingConnection(params)
        self.channel = connection.channel()
        self.channel.exchange_declare(exchange=EXCHANGE, exchange_type='direct')
        self.channel.queue_declare(queue=QUEUE_NAME)
        self.channel.queue_bind(queue=QUEUE_NAME, exchange=EXCHANGE, routing_key=NTF_ROUTING_KEY)
        self.channel.basic_qos(prefetch_count=1)
        self.channel.basic_consume(queue=QUEUE_NAME, on_message_callback=self.callback)

    def callback(self, ch, method, properties, body):
        logger.warning(f"{self.name} received: [{properties.content_type}]: {body.decode()}")
        url = "http://ntf:8000/notification/"
        match properties.content_type:
            case "group_ntf":
                url += "group/"
                post_request(url, json=json.loads(body.decode()))
            case "match_request_ntf":
                url += "match_req/"
                api_response = post_request(url, json=json.loads(body.decode()))
            case "friends_request_ntf":
                #logger.warning("ENTERED IN FRIEND REQ")
                url += "friends_req/"
                api_response = post_request(url, json=json.loads(body.decode()))
                #logger.warning(f"RESPONSE: {api_response.json()}\nSTATUS: {api_response.status_code}")
            case "info_ntf":
                url += "info/"
                post_request(url, json=json.loads(body.decode()))
            case "alert_ntf":
                url += "alert/"
                post_request(url, json=json.loads(body.decode()))
            case "ban_ntf":
                url += "ban/"
                post_request(url, json=json.loads(body.decode()))
            case _:
                pass
        ch.basic_ack(delivery_tag=method.delivery_tag)

    def run(self):
        logger.warning("Created listener")
        self.channel.start_consuming()

def my_main():
    threads = []
    for n in  range(int(THREAD)):
        threads.append(MyThread(name=f"thread_{n + 1}"))

    for thread in threads:
        thread.start()
    logger.warning("start")

if __name__=="__main__":
    print(RABBIT_HOST)
    print(RABBIT_PORT)
    print(EXCHANGE)
    print(NTF_ROUTING_KEY)
    print(THREAD)
    print(QUEUE_NAME)
    my_main()
