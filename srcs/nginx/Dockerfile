FROM nginx:1.25.3

RUN apt-get update && apt-get upgrade \
	&& apt-get install openssl -y \

ENV DAPHNE_PORT=8000
ENV DAPHNE_HOST="pong"
ENV NGINX_PORT=8080
ENV NGINX_HOST="nginx"
ENV WSGI_PORT=8080
ENV WSGI_HOST="localhost"
ENV GAME_PORT=8080
ENV GAME_HOST="localhost"
ENV CHAT_PORT=8080
ENV CHAT_HOST="localhost"

RUN mkdir /etc/nginx/certs

RUN mkdir /static
