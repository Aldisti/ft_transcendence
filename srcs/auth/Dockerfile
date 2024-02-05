FROM python:3.12.0

RUN apt update && apt upgrade -y 
RUN apt install vim -y

RUN pip install django \
	djangorestframework \
	djangorestframework-simplejwt

# postgres connection
RUN pip install psycopg
# two factor auth
RUN pip install pyotp
# for testing reasons
RUN pip install httpie
RUN pip install django-cors-headers
# for asgi server and channels
RUN pip install -U channels["daphne"]

RUN mkdir /etc/develop

COPY ./tools/setting.sh /etc/setting.sh
COPY ./conf/rsa /etc/.rsa

WORKDIR /etc/develop

ENTRYPOINT ["/bin/bash", "/etc/setting.sh"]

