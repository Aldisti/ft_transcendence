#!/bin/bash

PROJECT="./data/django/transcendence/"
DEL_PATH="migrations/0"

APPS=('accounts' 'authentication' 'email_manager' 'oauth2' \
		'two_factor_auth' 'friends' 'pong')

for app in ${APPS[@]}; do
	if ! echo "$PROJECT$app/$DEL_PATH"* | grep -q '*'; then
		echo "$PROJECT$app/$DEL_PATH"*
		rm -f "$PROJECT$app/$DEL_PATH"*
	fi
done

