#!/bin/bash

COMPOSE_TMP="./srcs/docker-compose.yml.tmp"
COMPOSE="./srcs/docker-compose.yml"
ENV_FILE="./srcs/.env"
CRON_ENV="./srcs/cron/.env"

RESET="\033[0m"
RED="\033[31;1m"
RED_LAMP="\033[31;1;5m"
GREEN="\033[32;1m"
BLUE="\033[34;1m"
PURPLE="\033[35;1m"
CYAN="\033[36;1m"

declare -A VOLUMES=(
	["django"]="./data/django"
	["django_db"]="./data/postgres"
	["pong"]="./data/pong"
	["pong_db"]="./data/pongdb"
	["auth"]="./data/auth"
	["auth_db"]="./data/authdb"
)

declare -A ENV_VARS=(
	["PROJECT_NAME"]="transcendence"
	["DB_NAME"]=transcendence""
	["DB_USER"]="$USERNAME"
	["DB_PASSWORD"]=""
	["DB_HOST"]="postgres"
	["DB_PORT"]="5432"
	["PGDATA"]="/var/lib/postgresql/data/pgdata"
	["PONGAPP_NAME"]="pong"
	["PONGDB_NAME"]="pong"
	["PONGDB_USER"]="$USERNAME"
	["PONGDB_PASSWORD"]=""
	["PONGDB_HOST"]="pongdb"
	["PONGDB_PORT"]="5432"
	["AUTH_NAME"]="authentication"
	["AUTH_DB_NAME"]="authentication"
	["AUTH_DB_USER"]="$USERNAME"
	["AUTH_DB_PASSWORD"]=""
	["AUTH_DB_HOST"]="authdb"
	["AUTH_DB_PORT"]="5432"
	["EMAIL_HOST"]="smtp.gmail.com"
	["EMAIL_HOST_USER"]="transcendence.trinity@gmail.com"
	["EMAIL_HOST_PASSWORD"]="awmvotojcdvmdwge"
	["SERVER_FRONTEND_IP"]="$(hostname -I | awk '{print $1}')"
	["INTRA_ID"]="u-s4t2ud-eff0cd3d5bfca5625c1acb7d97431e26ec2965c19596f83a6e2428d0870432d0"
	["INTRA_SECRET"]="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"
	["GOOGLE_ID"]="608692791188-2nkebjcfel5f7n5mlsvmtd1662i6bebl.apps.googleusercontent.com"
	["GOOGLE_SECRET"]="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"
	["RSA_PRIVATE_KEY_PATH"]="/etc/.rsa/rsa.pem"
	["RSA_PUBLIC_KEY_PATH"]="/etc/.rsa/rsa.crt"
)

create_env() {
	echo -e "${RED_LAMP}WARNING: remove default sensible data${RESET}"

	change=0
	for key in ${!ENV_VARS[@]}; do
		tmp="$(grep ^$key= $ENV_FILE | cut -d '=' -f2-)"
		if [ -n "$tmp" ]; then
			continue
		fi
		if [ -z "${ENV_VARS[$key]}" ]; then
			echo -n "* "
		else
			echo -n "  "
		fi
		if grep -qE "PASSWORD|SECRET" <<< "${key}"; then
			read -sp "Insert ${key} value: " value; echo
		else
			read -p "Insert ${key} value: " value
		fi
		if [ -z "${value}" ]; then
			value="${ENV_VARS[$key]}"
		fi
		if [ -z "${value}" ]; then
				echo "Error: '${key}' cannot be empty"
				exit 1
		fi
		if grep -qE "^$key" "$ENV_FILE"; then
			sed -i "s/^${key}=.*/${key}=\"${value}\"/" "$ENV_FILE"
		else
			echo "${key}=\"${value}\"" >> "$ENV_FILE"
		fi
		change=$((change + 1))
	done
	if [ ${change} -eq 0 ]; then
		echo -e "-> ${BLUE}env vars${RESET} already up-to-date"
	else
		echo "-> ${change}/${#ENV_VARS[@]} ${BLUE}env vars${RESET} updated"
	fi
}

create_volume_dirs() {
	created=0
	for key in ${!VOLUMES[@]}; do
		if [ ! -d "${VOLUMES[$key]}" ]; then
			mkdir -p ${VOLUMES[$key]}
			echo -e "${CYAN}${key} volume created${RESET}"
			created=$((created + 1))
		fi
	done
	if [ ${created} -eq 0 ]; then
		echo -e "-> ${BLUE}volumes${RESET} already up-to-date"
	else
		echo -e "-> ${created}/${#VOLUMES[@]} ${BLUE}volumes${RESET} created"
	fi
}

cron_env() {
	grep \
	-e "DB_NAME" \
	-e "DB_USER" \
	-e "DB_PASSWORD" \
	-e "DB_HOST" \
	-e "DB_PORT" \
	"$ENV_FILE" > "$CRON_ENV"
}

if [ ! -f "$ENV_FILE" ]; then
	touch "$ENV_FILE"
fi

create_env
create_volume_dirs
cron_env

