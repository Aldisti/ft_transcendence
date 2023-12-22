FROM python:3.12.0

RUN apt update && apt upgrade -y 
RUN apt install vim -y
RUN apt install gettext -y
RUN pip install django
RUN pip install djangorestframework
# postgres connection
RUN pip install psycopg
# tutorial rest_framework
RUN pip install pygments
# for testing reasons
RUN pip install httpie
RUN pip install django-cors-headers
RUN mkdir /etc/develop
COPY ./tools/setting.sh /etc/setting.sh
COPY ./conf/settings.py /tmp/settings.py
ENTRYPOINT ["/bin/bash", "/etc/setting.sh"]
