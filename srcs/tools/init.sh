#!/bin/bash

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
	["auth"]="./data/authentication"
	["auth_db"]="./data/authdb"
	["chat"]="./data/chat"
	["chat_db"]="./data/chatdb"
	["ntf"]="./data/ntf"
	["ntf_db"]="./data/ntfdb"
)

create_env() {
	echo -e "${RED_LAMP}WARNING: remove default sensible data${RESET}"

	python3 ./srcs/tools/setup.py

	if ! grep -q 'UID' "$ENV_FILE"; then
		echo "UID=\"$(id -u)\"" >> "$ENV_FILE"
	fi
	if ! grep -q 'GID' "$ENV_FILE"; then
		echo "GID=\"$(id -g)\"" >> "$ENV_FILE"
	fi
	if ! grep -q 'USERNAME' "$ENV_FILE"; then
		echo "USERNAME=\"$(id -nu)\"" >> "$ENV_FILE"
	fi
	if ! grep -q 'GROUPNAME' "$ENV_FILE"; then
		echo "GROUPNAME=\"$(id -ng)\"" >> "$ENV_FILE"
	fi
}

create_volume_dirs() {
	created=0
	for key in ${!VOLUMES[@]}; do
		if [ ! -d "${VOLUMES[$key]}" ]; then
			mkdir -p ${VOLUMES[$key]}
			echo -e "${CYAN}${key}${RESET} volume created"
			created=$((created + 1))
		fi
	done
	if [ ${created} -eq 0 ]; then
		echo -e "-> ${BLUE}volumes${RESET} already up-to-date"
	fi
}

create_env
create_volume_dirs
$SHELL ./srcs/tools/cron_env.sh

