#!/bin/bash

COMPOSE_TMP="./srcs/docker-compose.yml.tmp"
COMPOSE="./srcs/docker-compose.yml"
DJANGO_VOL="./data/django"
PONG_VOL="./data/pong"
PG_VOL="./data/postgres"
PONGDB_VOL="./data/pongdb"
ENV_FILE="./srcs/.env"
POSTGRES_ENV="./srcs/cron/.env"

ENV_VARS=("PROJECT_NAME" "DB_NAME" \
	"DB_USER" "DB_PASSWORD" \
	"DB_HOST" "DB_PORT" "PGDATA" \
	"EMAIL_HOST" "EMAIL_HOST_USER" "EMAIL_HOST_PASSWORD" \
	"PROJECT_NAME" "PONGDB_NAME" \
	"PONGDB_USER" "PONGDB_PASSWORD" \
	"PONGDB_HOST" "PONGDB_PORT")


create_env() {
	# default values for some env vars
	PROJECT_NAME="transcendence"
	DB_NAME="$PROJECT_NAME"
	DB_HOST="postgres"
	DB_PORT="5432"
	PGDATA="/var/lib/postgresql/data/pgdata"
	EMAIL_HOST="smtp.gmail.com"
	EMAIL_HOST_USER="transcendence.trinity@gmail.com"
	EMAIL_HOST_PASSWORD="awmvotojcdvmdwge"
	PONGAPP_NAME="pong"
	PONGDB_NAME="pong"
	PONGDB_USER="gpanico"
	PONGDB_PASSWORD="password"
	PONGDB_HOST="pongdb"
	PONGDB_PORT=5432

	k=""
	for var in ${ENV_VARS[@]}; do
		tmp="$(grep $var= $ENV_FILE | cut -d '=' -f2-)"
		if [ -z "$tmp" ]; then
			if grep -q "$var" <<< "DB_USER DB_PASSWORD"; then
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
			if [ -n "$value" ]; then
				declare "$var=$value"
			# else if the user doesn't insert a value
			# then is checked if the variable has a default value
			elif [ -z "$value" ] && [ -z "${!var}" ]; then
				echo "You have to insert a valid value for '$var'"
				exit 1
			fi
			# if the variable name is present inside the file
			# then the value will be added after the '='
			if grep -q "$var" "$ENV_FILE"; then
				sed -i "s/$var=.*/$var=${!var}/" "$ENV_FILE"
			# else a new line containing the variable name followed
			# by its value is appended to the end of the file
			else
				echo "$var=${!var}" >> "$ENV_FILE"
			fi
			k="1"
		fi
	done
	if [ -n "$k" ]; then
		echo "'.env' updated"
	fi
}

cron_env() {
#	if [ -n "$POSTGRES_ENV" ]; then
#		touch "$POSTGRES_ENV"
#	fi
#	if ! grep -q "DB_NAME=" "$POSTGRES_ENV"; then
#
#	fi
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

if ! [ -d $PG_VOL ]; then
	mkdir -p $PG_VOL
fi

if ! [ -d $PONGDB_VOL ]; then
	mkdir -p $PONGDB_VOL
fi

if [ ! -f "$ENV_FILE" ]; then
	touch "$ENV_FILE"
fi

create_env
cron_env

