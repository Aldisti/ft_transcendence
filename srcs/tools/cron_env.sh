#!/bin/bash

ENV_FILE="./srcs/cron/.env"

declare -A PROJECTS_PATH=(
	["DJANGO"]="./srcs/transcendence"
	["AUTH"]="./srcs/auth"
	["PONG"]="./srcs/pong"
	["CHAT"]="./srcs/chat"
	["NTF"]="./srcs/ntf"
)

PROJECTS="DJANGO AUTH PONG CHAT NTF"

VARS="DB_NAME DB_USER DB_PASSWORD DB_HOST DB_PORT"

update_cron_env()
{
	rm "$ENV_FILE"
	touch "$ENV_FILE"
	for project in $PROJECTS; do
		for var in $VARS; do
			echo ${project}_$(grep "$var" ${PROJECTS_PATH[$project]}/.env) >> $ENV_FILE
		done
	done
}

update_cron_env
