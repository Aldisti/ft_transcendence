import threading
import time
import sys
import pika
import os
import logging
import json
import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from requests import post as post_request

logger = logging.getLogger(__name__)

RABBIT_HOST = os.environ['RABBIT_HOST']
RABBIT_PORT = int(os.environ['RABBIT_PORT'])
RABBIT_USER = os.environ['RABBITMQ_DEFAULT_USER']
RABBIT_PASS = os.environ['RABBITMQ_DEFAULT_PASS']
VHOST = os.environ['VHOST']
EXCHANGE = os.environ['EXCHANGE']
EMAIL_ROUTING_KEY = os.environ['EMAIL_ROUTING_KEY']
THREAD = int(os.environ['THREAD'])
QUEUE_NAME = os.environ['QUEUE_NAME']
EMAIL_HOST = os.environ['EMAIL_HOST']
EMAIL_PORT = int(os.environ['EMAIL_PORT'])
EMAIL_PASSWORD = os.environ['EMAIL_HOST_PASSWORD'] 
SENDER_MAIL = os.environ['EMAIL_HOST_USER']


class MyThread(threading.Thread):
    def __init__(self, *args, **kwargs):
        super().__init__(group=None, *args, **kwargs)
        credentials = pika.PlainCredentials(RABBIT_USER, RABBIT_PASS)
        params = pika.ConnectionParameters(host=RABBIT_HOST, port=RABBIT_PORT, credentials=credentials)
        connection = pika.BlockingConnection(params)
        self.channel = connection.channel()
        self.channel.exchange_declare(exchange=EXCHANGE, exchange_type='direct')
        self.channel.queue_declare(queue=QUEUE_NAME)
        self.channel.queue_bind(queue=QUEUE_NAME, exchange=EXCHANGE, routing_key=EMAIL_ROUTING_KEY)
        self.channel.basic_qos(prefetch_count=1)
        self.channel.basic_consume(queue=QUEUE_NAME, on_message_callback=self.callback)

    def create_message(self, subject, receiver_mail, text, html):
        # create message
        message = MIMEMultipart("alternative")
        message["subject"] = subject
        message["from"] = SENDER_MAIL
        message["to"] = receiver_mail

        # convert mail body in MIME object of type text
        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")

        message.attach(part1)
        message.attach(part2)

        return message

    def callback(self, ch, method, properties, body):
        # logger.warning(f"{self.name} received: [{properties.content_type}]: {body.decode()}")

        # get body informations
        body = json.loads(body.decode())
        receiver_mail = body.get("receiver_mail", "")
        subject = body.get("subject", "")
        text = body.get("text", "")
        html = body.get("html", "")

        # get message
        message = self.create_message(subject, receiver_mail, text, html)

        # create secure context
        context = ssl.create_default_context()

        with smtplib.SMTP_SSL(EMAIL_HOST, EMAIL_PORT, context=context) as server:
            server.login(SENDER_MAIL, EMAIL_PASSWORD)
            server.sendmail(SENDER_MAIL, receiver_mail, message.as_string())
        ch.basic_ack(delivery_tag=method.delivery_tag)

    def run(self):
        try:
            # logger.warning("Created listener")
            self.channel.start_consuming()
        except:
            return

def my_main():
    while True:
        threads = []
        for n in  range(THREAD):
            threads.append(MyThread(name=f"thread_{n + 1}"))

        for thread in threads:
            thread.start()
        # logger.warning("all threads started")
        for thread in threads:
            thread.join()
        # logger.warning("all threads terminated")


if __name__=="__main__":
    my_main()
