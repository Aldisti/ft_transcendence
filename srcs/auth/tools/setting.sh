#!/bin/bash

if ! test -d $PROJECT_NAME
then
	django-admin startproject $PROJECT_NAME
fi

python $PROJECT_NAME/manage.py makemigrations
python $PROJECT_NAME/manage.py migrate
touch /etc/healthy
python $PROJECT_NAME/manage.py runserver 0.0.0.0:8000

