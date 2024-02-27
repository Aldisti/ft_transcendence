#!/bin/bash
QUERY="delete from jwt_token where exp < now();"
LOG_FILE="/var/log/query.log"
ENV_FILE="/etc/.env"
PGPASS_FILE="/etc/.pgpass"

source "$ENV_FILE"

export PGPASSFILE="$PGPASS_FILE"

psql -nqw \
	-h "$DJANGO_DB_HOST" \
	-p "$DJANGO_DB_PORT" \
	-d "$DJANGO_DB_NAME" \
	-U "$DJANGO_DB_USER" \
	-L "$LOG_FILE" \
	-c "$QUERY"

