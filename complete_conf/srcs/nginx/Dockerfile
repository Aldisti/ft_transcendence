FROM nginx:1.25.3

RUN apt-get update && apt-get upgrade \
	&& apt-get install openssl -y 

ENV FRONT_PORT=4242
ENV FRONT_HOST="transcendence"
ENV NGINX_PORT=9000
ENV NGINX_HOST="transcendence"
ENV PONG_PORT=7000
ENV PONG_HOST=pong
ENV TRANSCENDENCE_PORT=8000
ENV TRANSCENDENCE_HOST=django

RUN mkdir /etc/nginx/certs

RUN mkdir -p /var/www/transcendence/static
RUN mkdir -p /var/www/pong/static
