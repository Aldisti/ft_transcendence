FROM python:3.12.0

RUN apt update && apt upgrade -y 
RUN apt install vim -y
RUN apt install gettext -y

RUN pip install django
RUN pip install djangorestframework
# for jwt
RUN pip install djangorestframework-simplejwt
# postgres connection
RUN pip install psycopg
# for testing reasons
RUN pip install httpie
RUN pip install django-cors-headers
# for two factor authentication
RUN pip install pyotp
# for jwts
RUN pip install pyjwt && pip install pyjwt[crypto]
RUN pip install -U channels['daphne']
# for wsgi server
RUN pip install gunicorn



RUN mkdir /etc/develop
RUN mkdir /static

COPY ./tools/setting.sh /etc/setting.sh

ENTRYPOINT ["/bin/bash", "/etc/setting.sh"]

