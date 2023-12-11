#!/bin/bash

cd /etc/develop
if ! test -d $PROJECT_NAME
then
	django-admin startproject $PROJECT_NAME
fi
python $PROJECT_NAME/manage.py runserver 0.0.0.0:8000
