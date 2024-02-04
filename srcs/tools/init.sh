#!/bin/bash

COMPOSE_TMP="./srcs/docker-compose.yml.tmp"
COMPOSE="./srcs/docker-compose.yml"
DJANGO_VOL="./data/django"
PONG_VOL="./data/pong"
CHAT_VOL="./data/chat"
NTF_VOL="./data/ntf"
PG_VOL="./data/postgres"
PONGDB_VOL="./data/pongdb"
CHATDB_VOL="./data/chatdb"
NTFDB_VOL="./data/ntfdb"
ENV_FILE="./srcs/.env"
POSTGRES_ENV="./srcs/cron/.env"

ENV_VARS=("PROJECT_NAME" "DB_NAME" \
	"DB_USER" "DB_PASSWORD" \
	"DB_HOST" "DB_PORT" "PGDATA" \
	"EMAIL_HOST" "EMAIL_HOST_USER" "EMAIL_HOST_PASSWORD" \
	"PONGAPP_NAME" "PONGDB_NAME" \
	"PONGDB_USER" "PONGDB_PASSWORD" \
	"PONGDB_HOST" "PONGDB_PORT" \
	"CHATAPP_NAME" "CHATDB_NAME" \
	"CHATDB_USER" "CHATDB_PASSWORD" \
	"CHATDB_HOST" "CHATDB_PORT" \
	"NTFAPP_NAME" "NTFDB_NAME" \
	"NTFDB_USER" "NTFDB_PASSWORD" \
	"NTFDB_HOST" "NTFDB_PORT" "SERVER_FRONTEND_IP" \
	"EXCHANGE" "NTF_ROUTING_KEY" "THREAD" "NTF_QUEUE")


create_env() {
	# default values for some env vars
	PROJECT_NAME="transcendence"
	DB_NAME="$PROJECT_NAME"
	DB_HOST="postgres"
	DB_PORT="5432"
	PGDATA="/var/lib/postgresql/data/pgdata"
	EMAIL_HOST="smtp.gmail.com"
	EMAIL_HOST_USER="transcendence.trinity@gmail.com"
	echo -e "\033[31;1;5mWARNING: remove sensible data from init.sh\033[0m"
	EMAIL_HOST_PASSWORD="awmvotojcdvmdwge"
	PONGAPP_NAME="pong"
	PONGDB_NAME="pong"
	PONGDB_HOST="pongdb"
	PONGDB_PORT=5432
	CHATAPP_NAME="chat"
	CHATDB_NAME="chat"
	CHATDB_HOST="chatdb"
	CHATDB_PORT=5432
	NTFAPP_NAME="ntf"
	NTFDB_NAME="ntf"
	NTFDB_HOST="ntfdb"
	NTFDB_PORT=5432
	SERVER_FRONTEND_IP="localhost"
    EXCHANGE="my_exchange"
    NTF_ROUTING_KEY="notification"
    THREAD=5
    NTF_QUEUE="ntf_queue"
    VHOST_NTF="notification"
    RABBIT_HEARTBEAT=20
    RABBIT_BC_TIMEOUT=10

	k=""
	for var in ${ENV_VARS[@]}; do
		tmp="$(grep $var= $ENV_FILE | cut -d '=' -f2-)"
		if [ -z "$tmp" ]; then
			if [ -z "${!var}" ]; then
				echo -n "*"
			else
				echo -n " "
			fi
			if grep -q "PASSWORD" <<< "$var"; then
				read -sp "Insert '$var' value: " value; echo
			else
				read -p "Insert '$var' value: " value
			fi
			# if the user inserts a value then the variable's value is replaced
			# else if the user doesn't insert a value
			# then is checked if the variable has a default value
			if [ -n "$value" ]; then
				declare "$var=$value"
			elif [ -z "$value" ] && [ -z "${!var}" ]; then
				echo "You have to insert a valid value for '$var'"
				exit 1
			fi
			# if the variable name is present inside the file
			# then the value will be added after the '='
			if grep -q "$var" "$ENV_FILE"; then
				sed -i "s/$var=.*/$var=\"${!var}\"/" "$ENV_FILE"
			# else a new line containing the variable name followed
			# by its value is appended to the end of the file
			else
				echo "$var=\"${!var}\"" >> "$ENV_FILE"
			fi
			k="1"
		fi
	done
	if [ -n "$k" ]; then
		echo "'.env' updated"
	fi
}

cron_env() {
	grep \
	-e "DB_NAME" \
	-e "DB_USER" \
	-e "DB_PASSWORD" \
	-e "DB_HOST" \
	-e "DB_PORT" \
	"$ENV_FILE" > "$POSTGRES_ENV"
}

if ! [ -d $DJANGO_VOL ]; then
	mkdir -p $DJANGO_VOL
fi

if ! [ -d $PONG_VOL ]; then
	mkdir -p $PONG_VOL
fi

if ! [ -d $CHAT_VOL ]; then
	mkdir -p $CHAT_VOL
fi

if ! [ -d $NTF_VOL ]; then
	mkdir -p $NTF_VOL
fi

if ! [ -d $PG_VOL ]; then
	mkdir -p $PG_VOL
fi

if ! [ -d $PONGDB_VOL ]; then
	mkdir -p $PONGDB_VOL
fi

if ! [ -d $CHATDB_VOL ]; then
	mkdir -p $CHATDB_VOL
fi

if ! [ -d $NTFDB_VOL ]; then
	mkdir -p $NTFDB_VOL
fi

if [ ! -f "$ENV_FILE" ]; then
	touch "$ENV_FILE"
fi

create_env
cron_env
