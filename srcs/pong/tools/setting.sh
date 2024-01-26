#!/bin/bash

cd /etc/develop

if ! test -d $PROJECT_NAME
then
	django-admin startproject $PROJECT_NAME
fi

cd ${PROJECT_NAME}

python manage.py makemigrations
python manage.py migrate
#python manage.py runserver 0.0.0.0:8000


# export python setting settings
# https://docs.djangoproject.com/en/5.0/topics/settings/#designating-the-settings

export DJANGO_SETTINGS_MODULE=pong.settings

python manage.py collectstatic

daphne -b 0.0.0.0 -p 8000 ${PROJECT_NAME}.asgi:application
