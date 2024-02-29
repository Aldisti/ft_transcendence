"""
Django settings for authentication project.

Generated by 'django-admin startproject' using Django 5.0.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
from os import environ, path
from datetime import timedelta
from pytz import timezone


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-q!4rajej$m1kw02@_9ai5!zi1s^_hjm=_f62645em!e4*ujh5j'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]

ASGI_APPLICATION = 'authentication.asgi.application'

# Application definition

INSTALLED_APPS = [
    'daphne',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'users',
    'authorization',
    'oauth2',
    'two_factor_auth',
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
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'authentication.urls'

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

WSGI_APPLICATION = 'authentication.wsgi.application'


# Django REST Framework

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
    ],
    "DEFAULT_THROTTLE_RATES": {
        "high_load": "10/minute",
        "medium_load": "30/minute",
        "low_load": "60/minute",
    },
    'TEST_REQUEST_DEFAULT_FORMAT': 'json',
}

# Django SimpleJWT
# https://django-rest-framework-simplejwt.readthedocs.io/en/latest/settings.html

RSA_PRIVATE_KEY_PATH = f"/home/{environ['USERNAME']}/rsa/rsa.pem"
RSA_PUBLIC_KEY_PATH = f"/home/{environ['USERNAME']}/rsa/rsa.crt"

print(RSA_PRIVATE_KEY_PATH)
print()
print()
print()

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=2),  # TODO: change lifetime to at most 5 minutes
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),

    "ALGORITHM": "RS256",
    "SIGNING_KEY": open(RSA_PRIVATE_KEY_PATH, 'r').read(),
    "VERIFYING_KEY": open(RSA_PUBLIC_KEY_PATH, 'r').read(),
    "AUDIENCE": "transcendence",
    "ISSUER": "transcendence.auth",

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


# OAuth2 information

OAUTH2 = {
    "SERVER": {
        "PROTOCOL": "https",
        "HOST": "auth",
        "PORT": 8000,
    },
    "CLIENT": {
        "PROTOCOL": "https",
        "HOST": environ.get('SERVER_FRONTEND_IP'),
        "PORT": environ.get('FRONT_PORT'),
    },
    "INTRA": {
        "ID": environ['INTRA_ID'],
        "SECRET": environ['INTRA_SECRET'],
        "AUTH": "https://api.intra.42.fr/oauth/authorize",
        "TOKEN": "https://api.intra.42.fr/oauth/token",
        "INFO": "https://api.intra.42.fr/v2/me",
    },
    "GOOGLE": {
        "ID": environ['GOOGLE_ID'],
        "SECRET": environ['GOOGLE_SECRET'],
        "AUTH": "https://accounts.google.com/o/oauth2/v2/auth",
        "TOKEN": "https://oauth2.googleapis.com/token",
    },
    "response_type": "code",
    "grant_type": "authorization_code",
    "google_scope": "openid email",
}

OAUTH2["SERVER_URL"] = f"{OAUTH2['SERVER']['PROTOCOL']}://{OAUTH2['SERVER']['HOST']}:{OAUTH2['SERVER']['PORT']}"
OAUTH2["CLIENT_URL"] = f"{OAUTH2['CLIENT']['PROTOCOL']}://{OAUTH2['CLIENT']['HOST']}:{OAUTH2['CLIENT']['PORT']}"

OAUTH2.update({
    "INTRA_LOGIN_REDIRECT_URI": f"{OAUTH2['SERVER_URL']}/oauth2/intra/callback/login/",
    "INTRA_LINK_REDIRECT_URI": f"{OAUTH2['SERVER_URL']}/oauth2/intra/callback/link/",
    "INTRA_REDIRECT_URI": f"{OAUTH2['CLIENT_URL']}/intra/callback/",
    "GOOGLE_REDIRECT_URI": f"{OAUTH2['CLIENT_URL']}/google/callback",
    "CLIENT_REDIRECT_LOGIN": f"{OAUTH2['CLIENT_URL']}/login/",
    "CLIENT_REDIRECT_LINK": f"{OAUTH2['CLIENT_URL']}/home/",
})

OAUTH2["INTRA_REQUEST_BODY"] = {
    'grant_type': OAUTH2['grant_type'],
    'client_id': OAUTH2['INTRA']['ID'],
    'client_secret': OAUTH2['INTRA']['SECRET'],
    'redirect_uri': OAUTH2['INTRA_REDIRECT_URI'],
}

OAUTH2["GOOGLE_REQUEST_BODY"] = {
    "client_id": OAUTH2['GOOGLE']['ID'],
    "client_secret": OAUTH2['GOOGLE']['SECRET'],
    "redirect_uri": OAUTH2['GOOGLE_REDIRECT_URI'],
    "grant_type": OAUTH2['grant_type'],
}

# Two-Factor Authentication

TFA = {
    'EMAIL_INTERVAL': 100,
    'EMAIL_WINDOW': 1,
    'SOFTWARE_WINDOW': 1,
}

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

AUTH_PASSWORD_VALIDATORS = []


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Rome'
TZ = timezone(TIME_ZONE)

USE_I18N = False

USE_TZ = False

AUTH_USER_MODEL = "users.User"

# CorsHeaders

# CORS_ALLOW_ALL_ORIGINS = True
SERVER_FRONTEND_IP = environ['SERVER_FRONTEND_IP'] or 'localhost'
CORS_ALLOWED_ORIGINS = [f"https://{SERVER_FRONTEND_IP}:4200", f"https://{SERVER_FRONTEND_IP}:8000"]

CORS_ALLOW_CREDENTIALS = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
