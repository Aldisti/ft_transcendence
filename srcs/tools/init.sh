#!/bin/bash

COMPOSE_TMP="./srcs/docker-compose.yml.tmp"
COMPOSE="./srcs/docker-compose.yml"
PONG_VOL="./data/pong"
PONGDB_VOL="./data/pongdb"
ENV_FILE="./srcs/.env"
POSTGRES_ENV="./srcs/cron/.env"
STATIC="./static"

ENV_VARS=("PGDATA" "PONGAPP_NAME" "PONGDB_NAME" \
	"PONGDB_USER" "PONGDB_PASSWORD" \
	"PONGDB_HOST" "PONGDB_PORT" "SERVER_FRONTEND_IP")


create_env() {
	# default values for some env vars
	PGDATA="/var/lib/postgresql/data/pgdata"
	echo -e "\033[31;1;5mWARNING: remove sensible data from init.sh\033[0m"
	PONGAPP_NAME="pong"
	PONGDB_NAME="pong"
	PONGDB_HOST="pongdb"
	PONGDB_PORT=5432
	SERVER_FRONTEND_IP="localhost"

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

if ! [ -d $PONG_VOL ]; then
	mkdir -p $PONG_VOL
fi

if ! [ -d $PONGDB_VOL ]; then
	mkdir -p $PONGDB_VOL
fi

if [ ! -f "$ENV_FILE" ]; then
	touch "$ENV_FILE"
fi

if [ ! -d "$STATIC" ]; then
	mkdir "$STATIC"
fi

create_env
#cron_env
