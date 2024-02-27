FROM trinity/django:latest

RUN pip install channels-redis

COPY ./data/pong ./develop/pong
COPY ./certs ./certs
COPY ./rsa ./rsa

