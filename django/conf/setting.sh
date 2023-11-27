#!/bin/bash

django-admin startproject $PROJECT_NAME
python $PROJECT_NAME/manage.py runserver 0.0.0.0:8000
