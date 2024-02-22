FROM python:3.12.0

ARG USERNAME
ARG GROUPNAME
ARG UID
ARG GID

RUN apt update && apt upgrade -y
RUN apt install vim curl -y

RUN pip install -U \
	django \
	djangorestframework \
	djangorestframework-simplejwt \
	psycopg \
	requests \
	django-cors-headers \
	httpie \
	pyotp \
	pyjwt[crypto] \
	channels[daphne] \
	pika

RUN groupadd -g $GID $GROUPNAME
RUN useradd -m -u $UID -g $GID $USERNAME

USER $USERNAME

RUN mkdir -p /home/$USERNAME/develop

WORKDIR /home/$USERNAME/develop

COPY ./tools/setting.sh ../setting.sh

ENTRYPOINT ["/bin/bash", "../setting.sh"]

