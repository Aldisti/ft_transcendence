def get_func_credentials(func):
    """
    This decorator is used to set `api_headers` and `api_cookies` in `request`.
    In this way you can pass only some headers and cookies
    coming from the client to the api.
    """
    dec_headers = ['Authorization']
    dec_cookies = ['refresh_token', 'api_token', 'google_state', 'intra_state']

    def wrapper(request, *args, **kwargs):
        request.api_headers = {}
        request.api_cookies = {}
        for header in dec_headers:
            if header in request.headers:
                request.api_headers[header] = request.headers.get(header, '')
        for cookie in dec_cookies:
            if cookie in request.COOKIES:
                request.api_cookies[cookie] = request.COOKIES.get(cookie, '')
        if len(request.api_headers) == 0:
            request.api_headers = None
        if len(request.api_cookies) == 0:
            request.api_cookies = None
        return func(request, *args, **kwargs)

    return wrapper


def get_class_credentials(func):
    """
    This decorator is used to set `api_headers` and `api_cookies` in `request`.
    In this way you can pass only some headers and cookies
    coming from the client to the api.
    """
    dec_headers = ['Authorization']
    dec_cookies = ['refresh_token', 'api_token', 'google_state', 'intra_state']

    def wrapper(self, request, *args, **kwargs):
        request.api_headers = {}
        request.api_cookies = {}
        for header in dec_headers:
            if header in request.headers:
                request.api_headers[header] = request.headers.get(header, '')
        for cookie in dec_cookies:
            if cookie in request.COOKIES:
                request.api_cookies[cookie] = request.COOKIES.get(cookie, '')
        if len(request.api_headers) == 0:
            request.api_headers = None
        if len(request.api_cookies) == 0:
            request.api_cookies = None
        return func(self, request, *args, **kwargs)

    return wrapper
