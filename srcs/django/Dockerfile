FROM python:3.12.0

ARG USERNAME
ARG UID
ARG GID

RUN apt update && apt upgrade -y 
RUN apt install vim -y
RUN apt install gettext -y

RUN pip install django \
	djangorestframework \
	djangorestframework-simplejwt

# postgres connection
RUN pip install psycopg
RUN pip install requests
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

RUN addgroup --gid $GID $USERNAME
RUN adduser --uid $UID --gid $GID --disabled-password $USERNAME

USER $USERNAME

RUN mkdir -p /home/$USERNAME/develop/

COPY ./tools/setting.sh /home/$USERNAME/setting.sh

WORKDIR /home/$USERNAME/develop/

ENTRYPOINT ["/bin/bash", "../setting.sh"]

