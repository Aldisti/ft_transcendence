#!/bin/bash

PROJECT="./data/pong/pong/"
APPS=('pong')
DEL_PATH="migrations/0"

for i in ${APPS[@]}; do
	echo "$PROJECT$i/$DEL_PATH"*
	rm -f "$PROJECT$i/$DEL_PATH"*
done

