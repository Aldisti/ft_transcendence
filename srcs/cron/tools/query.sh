#!/bin/bash
QUERY="delete from jwt_token where exp < now();"
LOG_FILE="/var/log/query.log"
ENV_FILE="/etc/.env"
PGPASS_FILE="/etc/.pgpass"

source "$ENV_FILE"

export PGPASSFILE="$PGPASS_FILE"

psql -nqw \
	-h "$DB_HOST" \
	-p "$DB_PORT" \
	-d "$DB_NAME" \
	-U "$DB_USER" \
	-L "$LOG_FILE" \
	-c "$QUERY"

