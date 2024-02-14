FROM postgres:16-bookworm

ARG USERNAME
ARG UID
ARG GID

RUN addgroup --gid $GID $USERNAME
RUN adduser --uid $UID --gid $GID --disabled-password $USERNAME

RUN mkdir -p /var/lib/postgresql/data
RUN chown $UID:$GID /var/lib/postgresql/data

USER $USERNAME

