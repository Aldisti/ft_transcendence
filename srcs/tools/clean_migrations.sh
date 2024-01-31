#!/bin/bash

RED="\033[31;1m"
GREEN="\033[32;1m"
PURPLE="\033[36;1m"
RESET="\033[0m"

bash_version=$(bash --version | grep release | awk '{print $4}' | cut -d '.' -f1)
if [ $bash_version -lt 4 ]; then
	echo "Error: bash version too old."
	echo "Try to update to version 4 or later."
	exit 1
fi

DEL_PATH="/migrations/0"

declare -A PROJECTS_PATH=(
	['transcendence']='./data/django/transcendence' 
	['pong']='./data/pong/pong' 
	['auth']='./data/auth/authentication'
)

declare -A APPS_PATH=(
	['transcendence']="/accounts /authentication /chat /email_manager /friends /notifications /oauth2 /two_factor_auth /pong"
	['pong']="/users /matchmaking /game"
	['auth']="/auth_base"
)

remove_migrations()
{
	local project="$1"
	shift
	while [ $# -gt 0 ]; do
		local app=$1
		local migration_path="${project}${app}${DEL_PATH}"
		if ! echo "${migration_path}"* | grep -q '*'; then
			echo -e "${GREEN}${migration_path}"*"${RESET}"
			#rm -f "${migration_path}"*
		else
			echo -e "${RED}${migration_path}*${RESET}"
		fi
		shift
	done
}

for project in ${!PROJECTS_PATH[@]}; do
	echo -e "${PURPLE}${project}${RESET}"
	remove_migrations "${PROJECTS_PATH[$project]}" ${APPS_PATH[$project]}
done

