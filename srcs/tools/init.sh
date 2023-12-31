#!/bin/bash

COMPOSE_TMP="./srcs/docker-compose.yml.tmp"
COMPOSE="./srcs/docker-compose.yml"
PG_VOL="./data/postgres"
ENV_FILE="./srcs/.env"

ENV_VARS=("PROJECT_NAME" "DB_NAME" \
	"DB_USER" "DB_PASSWORD" \
	"DB_HOST" "DB_PORT" "PGDATA")


create_env() {
	# default values for some env vars
	PROJECT_NAME="transcendence"
	DB_NAME="$PROJECT_NAME"
	DB_HOST="postgres"
	DB_PORT="5432"
	PGDATA="/var/lib/postgresql/data/pgdata"

	for var in ${ENV_VARS[@]}; do
		tmp="$(grep $var= $ENV_FILE | cut -d '=' -f2-)"
		if [ -z "$tmp" ]; then
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
		fi
	done && echo "'.env' updated"
}

if ! [ -d $PG_VOL ]; then
	mkdir -p $PG_VOL
fi

sed "s&PLACEHOLDER&$PWD&g" $COMPOSE_TMP > $COMPOSE

if [ ! -f "$ENV_FILE" ]; then
	touch "$ENV_FILE"
fi
create_env
