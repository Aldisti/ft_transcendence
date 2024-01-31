#!/bin/bash

COMPOSE_TMP="./srcs/docker-compose.yml.tmp"
COMPOSE="./srcs/docker-compose.yml"
DJANGO_VOL="./data/django"
PONG_VOL="./data/pong"
PG_VOL="./data/postgres"
PONGDB_VOL="./data/pongdb"
ENV_FILE="./srcs/.env"
POSTGRES_ENV="./srcs/cron/.env"
AUTH_VOL="./data/auth"
AUTHDB_VOL="./data/authdb"

ENV_VARS=( \
"PROJECT_NAME" "DB_NAME" "DB_USER" "DB_PASSWORD" \
"DB_HOST" "DB_PORT" "PGDATA" \
"EMAIL_HOST" "EMAIL_HOST_USER" "EMAIL_HOST_PASSWORD" \
"PONGAPP_NAME" "PONGDB_NAME" "PONGDB_USER" "PONGDB_PASSWORD" \
"PONGDB_HOST" "PONGDB_PORT" "SERVER_FRONTEND_IP" \
"AUTH_NAME" "AUTH_DB_NAME" "AUTH_DB_USER" "AUTH_DB_PASSWORD" \
"AUTH_DB_HOST" "AUTH_DB_PORT" \
"INTRA_ID" "INTRA_SECRET" "GOOGLE_ID" "GOOGLE_SECRET" \
"RSA_PRIVATE_KEY_PATH" "RSA_PUBLIC_KEY_PATH"
)


create_env() {
	# default values for some env vars
	PROJECT_NAME="transcendence"
	DB_NAME="$PROJECT_NAME"
	DB_HOST="postgres"
	DB_PORT="5432"
	PGDATA="/var/lib/postgresql/data/pgdata"
	EMAIL_HOST="smtp.gmail.com"
	EMAIL_HOST_USER="transcendence.trinity@gmail.com"
	PONGAPP_NAME="pong"
	PONGDB_NAME="pong"
	PONGDB_HOST="pongdb"
	PONGDB_PORT=5432
	SERVER_FRONTEND_IP="localhost"
	RSA_PRIVATE_KEY_PATH="/etc/.rsa/rsa.pem"
	RSA_PUBLIC_KEY_PATH="/etc/.rsa/rsa.crt"
	AUTH_NAME="authentication"
	AUTH_DB_NAME="$AUTH_NAME"
	AUTH_DB_HOST="authdb"
	AUTH_DB_PORT="5432"
	# default sensible data
	echo -e "\033[31;1;5mWARNING: remove default sensible data\033[0m"
	EMAIL_HOST_PASSWORD="awmvotojcdvmdwge"
	INTRA_ID="u-s4t2ud-eff0cd3d5bfca5625c1acb7d97431e26ec2965c19596f83a6e2428d0870432d0"
	INTRA_SECRET="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"
	GOOGLE_ID="608692791188-2nkebjcfel5f7n5mlsvmtd1662i6bebl.apps.googleusercontent.com"
	GOOGLE_SECRET="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"

	k=""
	for var in ${ENV_VARS[@]}; do
		tmp="$(grep ^$var= $ENV_FILE | cut -d '=' -f2-)"
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
			# else a new line containing the variable name followed
			# by its value is appended to the end of the file
			if grep -q "$var" "$ENV_FILE"; then
				sed -i "s/$var=.*/$var=\"${!var}\"/" "$ENV_FILE"
			else
				echo "$var=\"${!var}\"" >> "$ENV_FILE"
			fi
			k="1"
		fi
	done
	if [ -n "$k" ]; then
		echo "'.env' updated"
	else
		echo "'.env' already up-to-date"
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

if ! [ -d $PG_VOL ]; then
	mkdir -p $PG_VOL
fi

if ! [ -d $PONGDB_VOL ]; then
	mkdir -p $PONGDB_VOL
fi

if ! [ -d $AUTH_VOL ]; then
	mkdir -p $AUTH_VOL
fi

if ! [ -d $AUTHDB_VOL ]; then
	mkdir -p $AUTHDB_VOL
fi

if [ ! -f "$ENV_FILE" ]; then
	touch "$ENV_FILE"
fi

create_env
cron_env

