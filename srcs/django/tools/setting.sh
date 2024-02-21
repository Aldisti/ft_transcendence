#!/bin/bash

if ! test -d images
then
	mkdir images
fi

if ! test -d $PROJECT_NAME
then
	django-admin startproject $PROJECT_NAME
fi

export USERNAME=$(whoami)

python $PROJECT_NAME/manage.py makemigrations
python $PROJECT_NAME/manage.py migrate

python $PROJECT_NAME/manage.py create_admin
if ! [ $? -eq 0 ]; then
	echo "\033[31;1;5mCouldn't create admin in $PROJECT_NAME\033[0m"
fi
python $PROJECT_NAME/manage.py runserver 0.0.0.0:8000

