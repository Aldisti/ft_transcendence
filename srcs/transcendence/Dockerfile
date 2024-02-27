FROM trinity/django:latest

RUN pip install names pillow

RUN mkdir images

COPY ./data/transcendence ./develop/transcendence
COPY ./certs ./certs
COPY ./rsa ./rsa

