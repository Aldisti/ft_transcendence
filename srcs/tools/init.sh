#!/bin/bash

COMPOSE_TMP="./srcs/docker-compose.yml.tmp"
COMPOSE="./srcs/docker-compose.yml"
PG_VOL="./data/postgres"

if ! [ -d $PG_VOL ]; then
	mkdir -p $PG_VOL
fi

sed "s&PLACEHOLDER&$PWD&g" $COMPOSE_TMP > $COMPOSE

