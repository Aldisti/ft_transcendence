FROM postgres:16-bookworm

RUN apt-get update && apt-get upgrade -y
RUN apt-get install cron vim -y

COPY ./conf/cronjob /etc/cron.d/query-cron
COPY ./tools/query.sh /usr/local/bin/query.sh

RUN touch /var/log/query.log
RUN chmod 0644 /etc/cron.d/query-cron
RUN chmod 0754 /usr/local/bin/query.sh
RUN crontab /etc/cron.d/query-cron

