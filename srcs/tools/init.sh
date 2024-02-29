#!/bin/bash

COMPOSE="./srcs/docker-compose.yml"
ENV_FILE="./srcs/.env"
CRON_ENV="./srcs/cron/.env"
CERT_DIR="./certs"
CERT_NAME="transcendence"
RSA_DIR="./rsa"
RSA_NAME="rsa"

RESET="\033[0m"
RED="\033[31;1m"
RED_LAMP="\033[31;1;5m"
GREEN="\033[32;1m"
BLUE="\033[34;1m"
PURPLE="\033[35;1m"
CYAN="\033[36;1m"

declare -A VOLUMES=(
	["django"]="/data/transcendence"
	["django_db"]="/data/postgres"
	["pong"]="/data/pong"
	["pong_db"]="/data/pongdb"
	["auth"]="/data/authentication"
	["auth_db"]="/data/authdb"
	["chat"]="/data/chat"
	["chat_db"]="/data/chatdb"
	["ntf"]="/data/ntf"
	["ntf_db"]="/data/ntfdb"
	["media"]="/media"
)

declare -A APPS_PATHS=(
	["django"]="./srcs/transcendence"
	["auth"]="./srcs/auth"
	["pong"]="./srcs/pong"
	["chat"]="./srcs/chat"
	["ntf"]="./srcs/ntf"
)

create_env()
{
	echo -e "${RED_LAMP}WARNING: remove default sensible data${RESET}"

	python3 ./srcs/tools/setup.py
	if ! [ $? -eq 0 ];then
		return $?
	fi

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
	# deploy mode
	if grep -q 'deploy' "$ENV_FILE"; then
		sed -i s_/^DEPLOY=.*/DEPLOY=\"$1\"/ "$ENV_FILE"
	else
		echo "DEPLOY=\"$1\"" >> "$ENV_FILE"
	fi
	local ip=$(grep 'SERVER_FRONTEND_IP' "$ENV_FILE" | cut -d '=' -f2 | tr '"' ' ' | awk '{print $1}')
	sed -i "s/^let ip = .*/let ip = \"$ip\"\;/" "./frontend/static/API/URL.js"
}

create_volume_dirs()
{
	created=0
	for key in ${!VOLUMES[@]}; do
		local vol_path="$PWD${VOLUMES[$key]}"
		if [ ! -d "$vol_path" ]; then
			mkdir -p "$vol_path"
			echo -e "${CYAN}${key}${RESET} volume created"
			created=$((created + 1))
		fi
	done
	if [ ${created} -eq 0 ]; then
		echo -e "-> ${BLUE}volumes${RESET} already up-to-date"
	fi
}

check_certs ()
{
	if ! [ -d $CERT_DIR ]; then
		mkdir $CERT_DIR
	fi
	local cert_path="$CERT_DIR/$CERT_NAME"
	if [ -f $cert_path.key ] && [ -f $cert_path.crt ]; then
		return 0
	fi
	openssl req -x509 -noenc -out "$cert_path.crt" -keyout "$cert_path.key" \
	-subj "/C=IT/ST=Italy/L=Rome/O=42/OU=Trinity/CN=transcendence/UID=trinity" \
	> /dev/null 2>&1
	echo -e "$PURPLE new certs created$RESET"
}

check_rsa ()
{
	if ! [ -d $RSA_DIR ]; then
		mkdir $RSA_DIR
	fi
	if [ -f "$RSA_DIR/$RSA_NAME.pem" ] && [ -f "$RSA_DIR/$RSA_NAME.crt" ]; then
		return 0
	fi
	openssl genrsa -out "$RSA_DIR/$RSA_NAME.pem" 2048
	openssl rsa -in "$RSA_DIR/$RSA_NAME.pem" -pubout -out "$RSA_DIR/$RSA_NAME.crt" \
	> /dev/null 2>&1
	echo -e "$PURPLE new rsa pair created$RESET"
}

check_django_keys ()
{
	for app in ${!APPS_PATHS[@]}; do
		if [ -f "${APPS_PATHS[$app]}/rsa/secret_key" ];then
			continue
		fi
		mkdir -p "${APPS_PATHS[$app]}/rsa/"
		key=$(python3 -c 'from secrets import token_hex; print(token_hex(32))')
		echo $key > "${APPS_PATHS[$app]}/rsa/secret_key"
	done
}

create_env 1
if ! [ $? -eq 0 ]; then
	echo -e "$RED create_env failed with code: $?"
	exit 1
fi
create_volume_dirs
$SHELL ./srcs/tools/cron_env.sh
if ! [ $? -eq 0 ]; then
	echo -e "$RED cron_env failed with code: $?"
	exit 1
fi
check_certs
check_rsa
check_django_keys

