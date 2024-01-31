#!/bin/bash

PROJECT="./data/pong/pong/"
APPS=('users' 'game' 'matchmaking')
DEL_PATH="migrations/0"

for app in ${APPS[@]}; do
	if ! echo "$PROJECT$app/$DEL_PATH"* | grep -q '*'; then
		echo "$PROJECT$app/$DEL_PATH"*
		rm -f "$PROJECT$app/$DEL_PATH"*
	fi
done
