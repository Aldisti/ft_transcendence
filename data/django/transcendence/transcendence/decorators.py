
def get_credentials(func):
    """
    This decorator is used to set `api_headers` and `api_cookies` in `request`.
    In this way you can pass only some headers and cookies
    coming from the client to the api.
    """

    def wrapper(request, *args, **kwargs):
        request.api_headers = {
            'Authorization': request.headers.get('Authorization', ''),
        }
        request.api_cookies = {
            'refresh_token': request.COOKIES.get('refresh_token', ''),
            'api_token': request.COOKIES.get('api_token', ''),
            'google_state': request.COOKIES.get('google_state', ''),
            'intra_state': request.COOKIES.get('intra_state', ''),
        }
        return func(request, *args, **kwargs)

    return wrapper
