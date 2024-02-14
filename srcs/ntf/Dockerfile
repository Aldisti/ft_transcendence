FROM python:3.12.0

ARG USERNAME
ARG UID
ARG GID

RUN apt update && apt upgrade -y 
RUN apt install vim curl -y

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
# for asgi server and channels
RUN pip install -U channels["daphne"]

RUN addgroup --gid $GID $USERNAME
RUN adduser --uid $UID --gid $GID --disabled-password $USERNAME

USER $USERNAME

RUN mkdir -p /home/$USERNAME/develop

WORKDIR /home/$USERNAME/develop

COPY ./tools/setting.sh ../setting.sh

ENTRYPOINT ["/bin/bash", "../setting.sh"]
