#!/bin/bash

HEALTH_FILE="/etc/healthy"

cd /etc/develop

if ! test -d images
then
	mkdir images
fi

if ! test -d $PROJECT_NAME
then
	django-admin startproject $PROJECT_NAME
fi

python $PROJECT_NAME/manage.py makemigrations
python $PROJECT_NAME/manage.py migrate

touch "$HEALTH_FILE"

python $PROJECT_NAME/manage.py runserver 0.0.0.0:8000

