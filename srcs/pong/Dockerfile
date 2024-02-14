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
RUN pip install psycopg \
	requests
# for testing reasons
RUN pip install django-cors-headers
# for asgi server and channels
RUN pip install -U channels["daphne"]

RUN addgroup --gid $GID $USERNAME
RUN adduser --uid $UID --gid $GID --disabled-password $USERNAME

USER $USERNAME

RUN mkdir /home/$USERNAME/develop

WORKDIR /home/$USERNAME/develop

COPY ./tools/setting.sh ../setting.sh

ENTRYPOINT ["/bin/bash", "../setting.sh"]

