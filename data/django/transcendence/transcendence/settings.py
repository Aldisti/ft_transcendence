"""
Django settings for transcendence project.

Generated by 'django-admin startproject' using Django 4.2.7.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
from os import environ, path

from datetime import timedelta
from pytz import timezone

from requests import get as get_request
from requests.exceptions import ConnectionError as ConnectionErrorRequest

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
PROTOCOL = "http"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]
# DEFAULT_HOST = "http://localhost:8000"

# Channels layer

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}

# Application definition

INSTALLED_APPS = [
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
    'friends',
    'pong',
    'chat',
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
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

# Django REST Framework

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": [
        "transcendence.permissions.IsUser",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "transcendence.throttles.DefaultThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "default": "180/minute",
        "low_load": "120/minute",
        "medium_load": "60/minute",
        "high_load": "30/minute",
        "email": "1/minute",
    }
}


# Django SimpleJWT
# https://django-rest-framework-simplejwt.readthedocs.io/en/latest/settings.html

RSA_PRIVATE_KEY_PATH = f"/home/{environ['USERNAME']}/rsa/rsa.pem"
RSA_PUBLIC_KEY_PATH = f"/home/{environ['USERNAME']}/rsa/rsa.crt"

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),

    "ALGORITHM": "RS256",
    "SIGNING_KEY": open(RSA_PRIVATE_KEY_PATH, 'r').read(),
    "VERIFYING_KEY": open(RSA_PUBLIC_KEY_PATH, 'r').read(),
    "AUDIENCE": "transcendence",
    "ISSUER": "transcendence.auth",

    "USER_ID_FIELD": "username",
    "USER_ID_CLAIM": "username",
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

AUTH_PASSWORD_VALIDATORS = []

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Rome'
TZ = timezone(TIME_ZONE)

USE_I18N = False

USE_TZ = False

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_ROOT = "static/"
STATIC_URL = "static/"
DEFAULT_USER_IMAGE = "default.jpeg"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Authentication

AUTH_USER_MODEL = "accounts.User"

# tmp for testing reasons
SERVER_FRONTEND_IP = environ['SERVER_FRONTEND_IP'] or 'localhost'
CORS_ALLOW_ALL_ORIGINS = True
# CORS_ALLOWED_ORIGINS = [f"http://{SERVER_FRONTEND_IP}:4200"]
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

MEDIA_ROOT = f"/home/{environ['USERNAME']}/media/"
MEDIA_URL = "media/"
FILE_UPLOAD_PERMISSIONS = 0o644

# validation

MIN_AGE = 14

# images

MAX_SIZE = 1_000_000
ALLOWED_EXT = ["jpg", "jpeg", "png", "gif"]
ALLOWED_TYPES = ["jpeg", "png", "gif"]
FILE_CATEGORY = "image"
MAX_NAME_LEN = 60

# messages

MAX_MESSAGES = 500
MAX_MESSAGE_LENGTH = 512

# microservices urls
CLIENT_PROT = 'https'

CHAT_HOST = environ['CHAT_HOST']
CHAT_PORT = 8000
CHAT_PROT = 'https'

PONG_HOST = environ['PONG_HOST']
PONG_PORT = 8000
PONG_PROT = 'https'

NTF_HOST = environ['NTF_HOST']
NTF_PORT = 8000
NTF_PROT = 'https'

AUTH_HOST = environ['AUTH_HOST']
AUTH_PORT = 8000
AUTH_PROT = 'https'

MS_URLS = {
    # chat urls
    "CHAT_REGISTER": f"{CHAT_PROT}://{CHAT_HOST}:{CHAT_PORT}/user/register/",
    "CHAT_TICKET": f"{CHAT_PROT}://{CHAT_HOST}:{CHAT_PORT}/user/ticket/",
    "CHAT_DELETE": f"{CHAT_PROT}://{CHAT_HOST}:{CHAT_PORT}/user/<pk>/delete/",
    "FRIENDS_SEND_REQ": f"{CHAT_PROT}://{CHAT_HOST}:{CHAT_PORT}/friends/request/send/",
    "FRIENDS_ACCEPT_REQ": f"{CHAT_PROT}://{CHAT_HOST}:{CHAT_PORT}/friends/request/accept/",
    "FRIENDS_REJECT_REQ": f"{CHAT_PROT}://{CHAT_HOST}:{CHAT_PORT}/friends/request/reject/",
    "FRIENDS_DELETE_REQ": f"{CHAT_PROT}://{CHAT_HOST}:{CHAT_PORT}/friends/request/delete/",
    "FRIENDS_ALL": f"{CHAT_PROT}://{CHAT_HOST}:{CHAT_PORT}/friends/all/",
    "FRIENDS_CHECK": f"{CHAT_PROT}://{CHAT_HOST}:{CHAT_PORT}/friends/",
    "MESSAGES_GET": f"{CHAT_PROT}://{CHAT_HOST}:{CHAT_PORT}/chat/messages/",
    # notification urls
    "NTF_REGISTER": f"{NTF_PROT}://{NTF_HOST}:{NTF_PORT}/user/register/",
    "NTF_TICKET": f"{NTF_PROT}://{NTF_HOST}:{NTF_PORT}/user/ticket/",
    "NTF_DELETE": f"{NTF_PROT}://{NTF_HOST}:{NTF_PORT}/user/<pk>/delete/",
    # pong urls
    "PONG_REGISTER": f"{PONG_PROT}://{PONG_HOST}:{PONG_PORT}/user/register/",
    "PONG_DELETE": f"{PONG_PROT}://{PONG_HOST}:{PONG_PORT}/user/<pk>/delete/",
    "MATCHMAKING_TOKEN": f"{PONG_PROT}://{PONG_HOST}:{PONG_PORT}/matchmaking/token/",
    "TOURNAMENT_LIST": f"{PONG_PROT}://{PONG_HOST}:{PONG_PORT}/tournaments/",
    "TOURNAMENT_CREATE": f"{PONG_PROT}://{PONG_HOST}:{PONG_PORT}/tournaments/create/",
    "TOURNAMENT_RETRIEVE": f"{PONG_PROT}://{PONG_HOST}:{PONG_PORT}/tournaments/<pk>/",
    "TOURNAMENT_REGISTER": f"{PONG_PROT}://{PONG_HOST}:{PONG_PORT}/tournaments/register/",
    "TOURNAMENT_UNREGISTER": f"{PONG_PROT}://{PONG_HOST}:{PONG_PORT}/tournaments/unregister/",
    "TOURNAMENT_GET_SCHEMA": f"{PONG_PROT}://{PONG_HOST}:{PONG_PORT}/tournaments/schema/<pk>/",
    "TOURNAMENT_GET_MATCHES": f"{PONG_PROT}://{PONG_HOST}:{PONG_PORT}/tournaments/matches/",
    "GAME_GET_MATCHES": f"{PONG_PROT}://{PONG_HOST}:{PONG_PORT}/game/matches/",
    "GAME_GET_RESULTS": f"{PONG_PROT}://{PONG_HOST}:{PONG_PORT}/game/results/",
    "GAME_GET_ALL_RESULTS": f"{PONG_PROT}://{PONG_HOST}:{PONG_PORT}/game/results/all/",
    "GAME_GET_STATS": f"{PONG_PROT}://{PONG_HOST}:{PONG_PORT}/game/stats/",
    "SEND_MATCH_REQ": f"{PONG_PROT}://{PONG_HOST}:{PONG_PORT}/game/match/",
    "DELETE_MATCH_REQ": f"{PONG_PROT}://{PONG_HOST}:{PONG_PORT}/game/match/delete/",
    "ACCEPT_MATCH_REQ": f"{PONG_PROT}://{PONG_HOST}:{PONG_PORT}/game/match/accept/",
    "REJECT_MATCH_REQ": f"{PONG_PROT}://{PONG_HOST}:{PONG_PORT}/game/match/reject/",
    # auth urls
    "AUTH_REGISTER": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/users/register/",
    "AUTH": {
        # users app
        "REGISTER": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/users/register/",
        "DELETE": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/users/delete/<pk>/",
        "INFO": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/users/info/<pk>/",
        "UPDATE_EMAIL": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/users/update/email/",
        "UPDATE_PASSWORD": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/users/update/password/",
        "UPDATE_ACTIVE": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/users/update/active/",
        "UPDATE_ROLE": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/users/update/role/",
        "VERIFY_EMAIL": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/users/verify/email/",
        "LIST_USERS": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/users/",
        # authorization app
        "LOGIN": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/auth/login/",
        "REFRESH": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/auth/refresh/",
        "LOGOUT": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/auth/logout/",
        "LOGOUT_ALL": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/auth/logout/all/",
        "PASSWORD_RECOVERY": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/auth/password/recovery/",
        "PASSWORD_RESET": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/auth/password/reset/",
        "EMAIL_DETAILS": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/auth/email/details/",
        "RETRIEVE_PUBKEY": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/auth/retrieve/public-key/",
        # oauth2 app
        "OAUTH2_LINKED": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/oauth2/linked/",
        "INTRA_URL": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/oauth2/intra/v2/url/",
        "INTRA_LINK": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/oauth2/intra/v2/link/",
        "INTRA_LOGIN": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/oauth2/intra/v2/login/",
        "INTRA_UNLINK": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/oauth2/intra/unlink/",
        "GOOGLE_URL": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/oauth2/google/v2/url/",
        "GOOGLE_LINK": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/oauth2/google/v2/link/",
        "GOOGLE_LOGIN": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/oauth2/google/v2/login/",
        "GOOGLE_UNLINK": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/oauth2/google/unlink/",
        # 2fa app
        "TFA_MANAGE": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/2fa/manage/",
        "TFA_LOGIN": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/2fa/validate/login/",
        "TFA_ACTIVATE": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/2fa/validate/activate/",
        "TFA_RECOVER": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/2fa/validate/recover/",
        "TFA_EMAIL": f"{AUTH_PROT}://{AUTH_HOST}:{AUTH_PORT}/2fa/otp/",
    },
    # emails
    # TODO: use variables instead of localhost and 4200
    "CLIENT_RESET_PAGE": f"{CLIENT_PROT}://{SERVER_FRONTEND_IP}:4242/password/reset/",
    "CLIENT_LOGIN_PAGE": f"{CLIENT_PROT}://{SERVER_FRONTEND_IP}:4242/login/",
}

# these are the urls used in the registration endpoint
# here should be present all the microservices registration endpoints

REGISTER_URLS = [
    MS_URLS['NTF_REGISTER'],
    MS_URLS['CHAT_REGISTER'],
    MS_URLS['PONG_REGISTER'],
    MS_URLS['AUTH_REGISTER'],
]

DELETE_URLS = [
    MS_URLS['NTF_DELETE'],
    MS_URLS['CHAT_DELETE'],
    MS_URLS['PONG_DELETE'],
]

# rabbit config

RABBIT = {
    "host": environ['RABBIT_HOST'],
    "port": int(environ['RABBIT_PORT']),
    "heartbeat": int(environ['RABBIT_HEARTBEAT']),
    "bc_timeout": int(environ['RABBIT_BC_TIMEOUT']),
    "exchange": environ['EXCHANGE'],
    "user": environ['RABBITMQ_DEFAULT_USER'],
    "pass": environ['RABBITMQ_DEFAULT_PASS'],
    "R_KEYS": {
        "ntf": environ['NTF_ROUTING_KEY'],
        "email": environ['EMAIL_ROUTING_KEY'],
    },
    "VHOSTS": {
        "ntf": environ['VHOST_NTF']
    },
}
