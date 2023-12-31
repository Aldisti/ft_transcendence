
QUERY="delete from jwt_token where exp < now();"
LOG_FILE="/var/log/query.log"

PG_PASSWORD="$POSTGRES_PASSWORD" psql -nq \
	-d $POSTGRES_DB \
	-U $POSTGRES_USER \
	-L $LOG_FILE \
	-c $QUERY

