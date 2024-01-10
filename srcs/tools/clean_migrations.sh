#!/bin/bash

PROJECT="./data/django/transcendence/"
APPS=('accounts' 'authentication' 'email_manager' 'oauth2' 'two_factor_auth')
DEL_PATH="migrations/0"

for i in ${APPS[@]}; do
	echo "$PROJECT$i/$DEL_PATH"*
	rm -f "$PROJECT$i/$DEL_PATH"*
done

