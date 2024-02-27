"""
Django settings for chat project.

Generated by 'django-admin startproject' using Django 5.0.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
from os import environ

from datetime import timedelta
from pytz import timezone

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-2it01v=3y2qq8cx@az4y#89m#g_nu21tvgjhrumtfe3*@sw(l2'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Asgi application

ASGI_APPLICATION = "chat.asgi.application"

# Channels layer

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}

# Application definition

INSTALLED_APPS = [
    'daphne',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.staticfiles',
    'rest_framework',
    'channels',
    'users',
    'messages',
    'friends',
    # cors
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # tmp for testing reasons
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

# Django REST Framework

REST_FRAMEWORK = {
}

ROOT_URLCONF = 'chat.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'chat.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': environ['DB_NAME'],
        'USER': environ['DB_USER'],
        'PASSWORD': environ['DB_PASSWORD'],
        'HOST': environ['DB_HOST'],
        'PORT': environ['DB_PORT'],
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Rome'
TZ = timezone(TIME_ZONE)

USE_I18N = False

USE_TZ = False


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# tmp for testing reasons
SERVER_FRONTEND_IP = environ['SERVER_FRONTEND_IP'] or 'localhost'
# CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [f"http://{SERVER_FRONTEND_IP}:4242"]
CORS_ALLOW_CREDENTIALS = True
APPEND_SLASH = False

# messages

MAX_MESSAGES = 500
MAX_MESSAGE_LENGTH = 512

# name of global group

G_GROUP = "global_group"

# rabbit config

RABBIT = {
    "host": environ['RABBIT_HOST'],
    "port": int(environ['RABBIT_PORT']),
    "user": environ['RABBITMQ_DEFAULT_USER'],
    "pass": environ['RABBITMQ_DEFAULT_PASS'],
    "heartbeat": int(environ['RABBIT_HEARTBEAT']),
    "bc_timeout": int(environ['RABBIT_BC_TIMEOUT']),
    "exchange": environ['EXCHANGE'],
    "R_KEYS": {
        "ntf": environ['NTF_ROUTING_KEY'],
    },
    "VHOSTS": {
        "ntf": environ['VHOST_NTF']
    },
}
