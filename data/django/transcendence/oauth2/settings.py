
from urllib.parse import quote
import logging


logger = logging.getLogger(__name__)

# Server info
SERVER_DOMAIN = "localhost"
SERVER_PORT = 8000
SERVER_PROTOCOL = "http"

# Client info
CLIENT_DOMAIN = "localhost"
CLIENT_PORT = 4200
CLIENT_PROTOCOL = "http"

# 42Intra APIs
INTRA_AUTH = "https://api.intra.42.fr/oauth/authorize"
INTRA_TOKEN = "https://api.intra.42.fr/oauth/token"
INTRA_USER_INFO = "https://api.intra.42.fr/v2/me"

# Google APIs
GOOGLE_AUTH = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN = "https://oauth2.googleapis.com/token"
GOOGLE_USER_INFO = ""

# 42Intra Credentials

INTRA_CLIENT_ID = "u-s4t2ud-eff0cd3d5bfca5625c1acb7d97431e26ec2965c19596f83a6e2428d0870432d0"
INTRA_CLIENT_SECRET = "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"

# Google Credentials

GOOGLE_CLIENT_ID = "608692791188-2nkebjcfel5f7n5mlsvmtd1662i6bebl.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"

# 42Intra redirect URIs

INTRA_LOGIN_REDIRECT_URI = f"{SERVER_PROTOCOL}://{SERVER_DOMAIN}:{SERVER_PORT}/oauth2/intra/callback/login/"
INTRA_LINK_REDIRECT_URI = f"{SERVER_PROTOCOL}://{SERVER_DOMAIN}:{SERVER_PORT}/oauth2/intra/callback/link/"
INTRA_REDIRECT_URI = f"{SERVER_PROTOCOL}://{SERVER_DOMAIN}:{SERVER_PORT}/oauth2/intra/callback/"


# Google redirect URIs

GOOGLE_REDIRECT_URI = f"{CLIENT_PROTOCOL}://{CLIENT_DOMAIN}:{CLIENT_PORT}/google/callback"


# Client redirects

CLIENT_REDIRECT_LOGIN = f"{CLIENT_PROTOCOL}://{CLIENT_DOMAIN}:{CLIENT_PORT}/login/"
CLIENT_REDIRECT_LINK = f"{CLIENT_PROTOCOL}://{CLIENT_DOMAIN}:{CLIENT_PORT}/account/"


# OAuth2 types

RESPONSE_TYPE = "code"
GRANT_TYPE = "authorization_code"
GOOGLE_SCOPE = "openid email"


URL_AUTHORIZE = (f'{INTRA_AUTH}?'
                 f'client_id={INTRA_CLIENT_ID}&'
                 f'redirect_uri={quote(INTRA_LOGIN_REDIRECT_URI)}&'
                 f'response_type={RESPONSE_TYPE}')


# !!! code and state need to be filled during runtime
INTRA_REQUEST_BODY = {
    'grant_type': GRANT_TYPE,
    'client_id': INTRA_CLIENT_ID,
    'client_secret': INTRA_CLIENT_SECRET,
    'redirect_uri': INTRA_REDIRECT_URI,
}

# !!! code and state need to be filled during runtime
GOOGLE_REQUEST_BODY = {
    'client_id': GOOGLE_CLIENT_ID,
    'client_secret': GOOGLE_CLIENT_SECRET,
    'redirect_uri': GOOGLE_REDIRECT_URI,
    'grant_type': 'authorization_code',
}

INTRA_USER_DATA = ['login', 'email', 'first_name', 'last_name']
