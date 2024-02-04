"""
Django settings for transcendence project.

Generated by 'django-admin startproject' using Django 4.2.7.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
from os import environ

from datetime import timedelta
from pytz import timezone

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-&1ve_f1=v5e9=n$(u=@dfjxh)a93!&#39qi9f2atxuqn%mafyj'

# HTTPS
# SECURE_SSL_REDIRECT = True
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]
#DEFAULT_HOST = "http://localhost:8000"

# Asgi application

ASGI_APPLICATION = "transcendence.asgi.application"

# Channels layer

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}

# Application definition

INSTALLED_APPS = [
    'daphne',
    # 'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'accounts',
    'authentication',
    'email_manager',
    'oauth2',
    'two_factor_auth',
    'channels',
    'chat',
    'notifications',
    'friends',
    'multiplayer_test',
    'pong',
    # tmp for testing reasons
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
    "DEFAULT_AUTHENTICATION_CLASSES": (
        # "rest_framework_simplejwt.authentication.JWTStatelessUserAuthentication",
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": [
        "authentication.permissions.IsUser",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.ScopedRateThrottle",
        "authentication.throttles.AnonAuthThrottle",
        "authentication.throttles.UserAuthThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "auth": "30/minute",
        "high_load": "10/minute",
        "medium_load": "30/minute",
        "low_load": "60/minute",
        "email": "1/minute",
    }
}

# Django SimpleJWT
# https://django-rest-framework-simplejwt.readthedocs.io/en/latest/settings.html

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),

    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "VERIFYING_KEY": "",
    "AUDIENCE": "localhost",
    "ISSUER": "localhost",

    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "username",
    "USER_ID_CLAIM": "username",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",

    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",

    "TOKEN_OBTAIN_SERIALIZER": "authentication.serializers.MyTokenObtainPairSerializer",
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
}


# Logging settings
# https://docs.djangoproject.com/en/4.2/howto/logging/

# LOGGING = {}


ROOT_URLCONF = 'transcendence.urls'


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

WSGI_APPLICATION = 'transcendence.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

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
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Rome'
TZ = timezone(TIME_ZONE)

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_ROOT = "/etc/develop/static/"
STATIC_URL = "static/"
DEFAULT_USER_IMAGE = "default.jpeg"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Authentication

AUTH_USER_MODEL = "accounts.User"

# tmp for testing reasons
SERVER_FRONTEND_IP = environ['SERVER_FRONTEND_IP'] or 'localhost'
# CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [f"http://{SERVER_FRONTEND_IP}:4242"]
CORS_ALLOW_CREDENTIALS = True
APPEND_SLASH = False

# email

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = environ['EMAIL_HOST']
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = environ['EMAIL_HOST_USER']
EMAIL_HOST_PASSWORD = environ['EMAIL_HOST_PASSWORD']

# storage

MEDIA_ROOT = "/etc/develop/images/"
MEDIA_URL = "/media/"
FILE_UPLOAD_PERMISSIONS = 0o644

# validation

MIN_AGE = 14

# images

MAX_SIZE = 1_000_000
ALLOWED_EXT = ["jpg", "jpeg", "png", "gif"]
ALLOWED_TYPES = ["jpeg", "png", "gif"]
FILE_CATEGORY = "image"

# messages

MAX_MESSAGES = 500
MAX_MESSAGE_LENGTH = 512

# microservices urls

CHAT_HOST = environ['CHAT_HOST']
CHAT_PORT = environ['CHAT_PORT']

PONG_HOST = environ['PONG_HOST']
PONG_PORT = environ['PONG_PORT']

NTF_HOST = environ['NTF_HOST']
NTF_PORT = environ['NTF_PORT']

MS_URLS = {
    "CHAT_REGISTER": f"http://{CHAT_HOST}:{CHAT_PORT}/user/register/",
    "CHAT_TICKET": f"http://{CHAT_HOST}:{CHAT_PORT}/user/ticket/",
    "CHAT_DELETE": f"http://{CHAT_HOST}:{CHAT_PORT}/user/<pk>/delete/",
    "NTF_REGISTER": f"http://{NTF_HOST}:{NTF_PORT}/user/register/",
    "NTF_TICKET": f"http://{NTF_HOST}:{NTF_PORT}/user/ticket/",
    "NTF_DELETE": f"http://{NTF_HOST}:{NTF_PORT}/user/<pk>/delete/",
    "PONG_REGISTER": f"http://{PONG_HOST}:{PONG_PORT}/user/register/",
    "PONG_DELETE": f"http://{PONG_HOST}:{PONG_PORT}/user/<pk>/delete/",
}

# rabbit config

RABBIT = {
    "host": environ['RABBIT_HOST'],
    "port": int(environ['RABBIT_PORT']),
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
