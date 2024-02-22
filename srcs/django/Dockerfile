FROM python:3.12.0

ARG USERNAME
ARG GROUPNAME
ARG UID
ARG GID

RUN apt update && apt upgrade -y
RUN apt install vim curl -y

RUN pip install -U \
	django==5.0.2 \
	djangorestframework==3.14.0 \
	djangorestframework-simplejwt==5.3.1 \
	psycopg==3.1.18 \
	requests==2.31.0 \
	django-cors-headers==4.3.1 \
	pyotp==2.9.0 \
	pyjwt['crypto']==2.8.0 \
	channels['daphne']==4.0.0 \
	gunicorn==21.2.0 \
	pika==1.3.2

RUN groupadd -g $GID $GROUPNAME
RUN useradd -m -u $UID -g $GID $USERNAME

USER $USERNAME

RUN mkdir -p /home/$USERNAME/develop
RUN mkdir -p /home/$USERNAME/certs

WORKDIR /home/$USERNAME/develop

COPY ./tools/setting.sh ../setting.sh

ENTRYPOINT ["/bin/bash", "../setting.sh"]

