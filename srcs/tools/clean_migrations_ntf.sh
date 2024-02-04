#!/bin/bash

PROJECT="./data/ntf/ntf/"
APPS=('users notifications')
DEL_PATH="migrations/0"

for app in ${APPS[@]}; do
	if ! echo "$PROJECT$app/$DEL_PATH"* | grep -q '*'; then
		echo "$PROJECT$app/$DEL_PATH"*
		rm -f "$PROJECT$app/$DEL_PATH"*
	fi
done
