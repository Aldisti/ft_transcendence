#!/bin/bash

cd /etc/develop
if ! test -d $PROJECT_NAME
then
	django-admin startproject $PROJECT_NAME
	envsubst '$DB_USER $DB_NAME $DB_PASSWORD $DB_HOST $DB_PORT' < /tmp/settings.py > ./$PROJECT_NAME/settings.py
fi

python $PROJECT_NAME/manage.py makemigrations
python $PROJECT_NAME/manage.py migrate
python $PROJECT_NAME/manage.py runserver 0.0.0.0:8000

