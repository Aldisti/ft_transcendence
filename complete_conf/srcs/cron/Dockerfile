FROM debian:bookworm

RUN apt update && apt upgrade -y
RUN apt install cron vim procps postgresql-client -qy

COPY ./conf/crontab /var/spool/cron/crontabs/root
COPY ./tools/query.sh /usr/local/bin/query.sh
COPY ./.env /etc/.env

COPY ./tools/init.sh /tmp/init.sh
RUN chmod +x /tmp/init.sh
RUN /tmp/init.sh

RUN chmod 0600 /var/spool/cron/crontabs/root /etc/.env
RUN chmod 0754 /usr/local/bin/query.sh

ENTRYPOINT ["cron", "-f", "daemon off;"]

