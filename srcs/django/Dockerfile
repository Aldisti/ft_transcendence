FROM python:3.12.0

RUN apt update && apt upgrade -y 
RUN apt install vim -y
RUN apt install gettext -y

RUN pip install django \
	djangorestframework \
	djangorestframework-simplejwt

# postgres connection
RUN pip install psycopg
# for testing reasons
RUN pip install httpie
RUN pip install django-cors-headers
# for two factor authentication
RUN pip install pyotp
# for jwts
RUN pip install pyjwt && pip install pyjwt[crypto]
# for asgi server and channels
RUN pip install -U channels["daphne"]
# for rabbitMq
RUN pip install pika


RUN mkdir /etc/develop

COPY ./tools/setting.sh /etc/setting.sh
COPY ./conf/rsa /etc/.rsa

ENTRYPOINT ["/bin/bash", "/etc/setting.sh"]

