FROM debian:bookworm

RUN apt update && apt upgrade -y
RUN apt install cron curl vim procps postgresql-client -qy

COPY ./conf/crontab /var/spool/cron/crontabs/root
COPY ./tools/query.sh /usr/local/bin/query.sh
COPY ./tools/init.sh /tmp/init.sh
COPY ./.env /etc/.env

RUN chmod +x /tmp/init.sh
RUN /tmp/init.sh
RUN rm /tmp/init.sh

RUN chmod 0600 /var/spool/cron/crontabs/root /etc/.env
RUN chmod 0754 /usr/local/bin/query.sh

ENTRYPOINT ["cron", "-f", "daemon off;"]

