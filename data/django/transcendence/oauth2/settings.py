
from urllib.parse import quote, unquote

# 42Intra APIs
INTRA_AUTH = "https://api.intra.42.fr/oauth/authorize"
INTRA_TOKEN = "https://api.intra.42.fr/oauth/token"
INTRA_USER_INFO = "https://api.intra.42.fr/v2/me"

# Google APIs


# 42Intra Credentials
INTRA_CLIENT_ID = "u-s4t2ud-eff0cd3d5bfca5625c1acb7d97431e26ec2965c19596f83a6e2428d0870432d0"
INTRA_CLIENT_SECRET = "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"

# Google Credentials
GOOGLE_CLIENT_ID = "608692791188-2nkebjcfel5f7n5mlsvmtd1662i6bebl.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"

# 42Intra redirect URIs
INTRA_LOGIN_REDIRECT_URI = "http://localhost:8000/oauth2/intra/callback/login/"
INTRA_LINK_REDIRECT_URI = "http://localhost:8000/oauth2/intra/callback/link/"
INTRA_REDIRECT_URI = "http://localhost:8000/oauth2/intra/callback/"

# Google redirect URIs
GOOGLE_REDIRECT_URI = "http://localhost:8000/oauth2/google/callback/"

RESPONSE_TYPE = "code"
GRANT_TYPE = "authorization_code"

URL_AUTHORIZE = (f'{INTRA_AUTH}?'
                 f'client_id={INTRA_CLIENT_ID}&'
                 f'redirect_uri={quote(INTRA_LOGIN_REDIRECT_URI)}&'
                 f'response_type={RESPONSE_TYPE}')

# !!! code and state need to be filled during runtime
USER_INFO_DATA = {
    'grant_type': GRANT_TYPE,
    'client_id': INTRA_CLIENT_ID,
    'client_secret': INTRA_CLIENT_SECRET,
    'redirect_uri': INTRA_REDIRECT_URI,
}

INTRA_USER_DATA = ['login', 'email', 'first_name', 'last_name']
