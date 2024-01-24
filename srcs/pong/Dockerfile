FROM python:3.12.0

RUN apt update && apt upgrade -y 
RUN apt install vim -y
RUN apt install gettext -y

RUN pip install django
RUN pip install djangorestframework
# postgres connection
RUN pip install psycopg
# for testing reasons
RUN pip install django-cors-headers
# for asgi server and channels
RUN pip install -U channels["daphne"]


RUN mkdir /etc/develop

COPY ./tools/setting.sh /etc/setting.sh

ENTRYPOINT ["/bin/bash", "/etc/setting.sh"]

