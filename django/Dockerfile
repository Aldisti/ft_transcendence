FROM python:3.12.0

RUN apt update && apt upgrade -y 
RUN apt install vim -y
RUN pip install django
RUN pip install djangorestframework
# tutorial rest_framework
RUN pip install pygments
# for testing reasons
RUN pip install httpie
RUN mkdir /etc/develop
COPY ./conf/setting.sh /etc/setting.sh
ENTRYPOINT ["/bin/bash", "/etc/setting.sh"]
