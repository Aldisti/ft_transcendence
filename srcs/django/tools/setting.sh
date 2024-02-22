#!/bin/bash

GUNICORN_SERVERS="transcendence authentication"
DAPHNE_SERVERS="pong chat ntf"

export USERNAME=$(whoami)
export CERTS_DIR="/home/$USERNAME/certs"
export DJANGO_SETTINGS_MODULE=${PROJECT_NAME}.settings


python $PROJECT_NAME/manage.py makemigrations
python $PROJECT_NAME/manage.py migrate
python $PROJECT_NAME/manage.py create_admin
if ! [ $? -eq 0 ]; then
	echo "\033[31;1;5mCouldn't create admin in $PROJECT_NAME\033[0m"
fi


# development
python $PROJECT_NAME/manage.py runserver 0.0.0.0:8000

if grep $PROJECT_NAME <<< "$GUNICORN_SERVERS"; then # GUNICORN
	# https
	# gunicorn -w 4 -b 0.0.0.0 -p 8000 --keyfile $CERTS_DIR/transcendence.key --certfile $CERTS_DIR/transcendence.crt ${PROJECT_NAME}.wsgi:application

	# http
	gunicorn -w 4 -b 0.0.0.0 -p 8000 ${PROJECT_NAME}.wsgi:application
elif grep $PROJECT_NAME <<< "$DAPHNE_SERVERS"; then # DAPHNE
	# https
	# daphne -b 0.0.0.0 -p 8001 -e ssl:8000:privateKey=$CERTS_DIR/transcendence.key:certKey=$CERTS_DIR/transcendence.crt ${PROJECT_NAME}.asgi:application
	# http
	daphne -b 0.0.0.0 -p 8000 ${PROJECT_NAME}.asgi:application
else
	echo "$PROJECT_NAME not in daphne or gunicorn lists"
	exit 101
fi
