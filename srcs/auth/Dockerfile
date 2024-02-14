FROM python:3.12.0

ARG USERNAME
ARG UID
ARG GID

RUN apt update && apt upgrade -y 
RUN apt install vim -y

RUN pip install django \
	djangorestframework \
	djangorestframework-simplejwt

RUN pip install psycopg \
	pyotp \
	requests \
	httpie \
	django-cors-headers
RUN pip install -U channels["daphne"]

RUN addgroup --gid $GID $USERNAME
RUN adduser --uid $UID --gid $GID --disabled-password $USERNAME

# TODO: remove this?
COPY ./conf/rsa /etc/.rsa
RUN chown -R $UID:$GID /etc/.rsa

USER $USERNAME

RUN mkdir -p /home/$USERNAME/develop/

COPY ./tools/setting.sh /home/$USERNAME/setting.sh

WORKDIR /home/$USERNAME/develop/

ENTRYPOINT ["/bin/bash", "../setting.sh"]

