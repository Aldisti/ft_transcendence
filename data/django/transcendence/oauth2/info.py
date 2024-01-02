
from urllib.parse import quote

API_AUTH = "https://api.intra.42.fr/oauth/authorize"
API_TOKEN = "https://api.intra.42.fr/oauth/token"
API_USER_INFO = "https://api.intra.42.fr/v2/me"

CLIENT_ID = "u-s4t2ud-eff0cd3d5bfca5625c1acb7d97431e26ec2965c19596f83a6e2428d0870432d0"
CLIENT_SECRET = "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"

REDIRECT_URI = "http://localhost:8000/oauth2/42/callback"

RESPONSE_TYPE = "code"
GRANT_TYPE = "authorization_code"

URL_AUTHORIZE = (f'{API_AUTH}?'
                 f'client_id={CLIENT_ID}&'
                 f'redirect_uri={quote(REDIRECT_URI)}&'
                 f'response_type={RESPONSE_TYPE}')

# !!! code and state need to be filled during runtime
USER_INFO_DATA = {
    'grant_type': GRANT_TYPE,
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'redirect_uri': REDIRECT_URI,
}

API_USER_DATA = ['username', 'email', 'first_name', 'last_name']
