#!/bin/bash

ENV_FILE="/etc/.env"
PGPASS_FILE="/etc/.pgpass"

source "$ENV_FILE"

echo "$DB_HOST:$DB_PORT:$DB_NAME:$DB_USER:$DB_PASSWORD" > "$PGPASS_FILE"
chmod 600 "$PGPASS_FILE"

