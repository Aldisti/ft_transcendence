FROM nginx:1.25.3

RUN apt update && apt upgrade -y
RUN apt install openssl vim -y

ARG USERNAME
ARG GROUPNAME
ARG UID
ARG GID

RUN groupadd -g $GID $GROUPNAME
RUN useradd -m -u $UID -g $GID $USERNAME
RUN usermod -a -G $GROUPNAME nginx

#RUN chown -R $UID:$GID /var/cache/nginx
#RUN chown -R $UID:$GID /var/run/

#USER $USERNAME

RUN mkdir -p /home/$USERNAME

WORKDIR /home/$USERNAME/

RUN mkdir -p images/media
RUN chown -R $UID:$GID images/media
RUN mkdir /home/$USERNAME/certs \
		/home/$USERNAME/django \
		/home/$USERNAME/auth \
		/home/$USERNAME/pong \
		/home/$USERNAME/chat \
		/home/$USERNAME/ntf

CMD ["nginx","-g","daemon off;"]

