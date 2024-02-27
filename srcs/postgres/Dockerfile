FROM postgres:16-bookworm

ARG USERNAME
ARG GROUPNAME
ARG UID
ARG GID
ARG PGDATA

#RUN groupadd -g $GID $GROUPNAME
#RUN useradd -m -u $UID -g $GID $USERNAME

RUN mkdir -p /var/lib/postgresql/data/pgdata
RUN chown $UID:$GID /var/lib/postgresql/data/pgdata

USER $USERNAME

