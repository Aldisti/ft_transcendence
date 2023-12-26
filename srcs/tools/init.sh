#!/bin/bash

COMPOSE_TMP="./srcs/docker-compose.yml.tmp"
COMPOSE="./srcs/docker-compose.yml"
PG_VOL="./data/postgres"
ENV_FILE="./srcs/.env"

ENV_VARS=("PROJECT_NAME" "DB_NAME" \
	"DB_USER" "DB_PASSWORD" \
	"DB_HOST" "DB_PORT" "PGDATA")

create_env() {
	for var in ${ENV_VARS[@]}; do
		tmp="$(grep $var= $ENV_FILE | cut -d '=' -f2-)"
		if [ -z "$tmp" ]; then
			if grep -q "PASSWORD" <<< "$var"; then
				read -sp "Insert '$var' value: " value; echo
			else
				read -p "Insert '$var' value: " value
			fi
			if [ "$var" = "PGDATA" ] && [ "$value" = "" ]; then
				value="/var/lib/postgresql/data/pgdata"
			fi
			if grep -q "$var" "$ENV_FILE"; then
				sed -i "s/$var=.*/$var=$value/" "$ENV_FILE"
			else
				echo "$var=$value" >> "$ENV_FILE"
			fi
		else
			declare "$var=$tmp"
		fi
	done && echo "'.env' updated"
}

if ! [ -d $PG_VOL ]; then
	mkdir -p $PG_VOL
fi

sed "s&PLACEHOLDER&$PWD&g" $COMPOSE_TMP > $COMPOSE

if [ ! -f "$ENV_FILE" ]; then
	touch "$ENV_FILE"
	create_env
fi

