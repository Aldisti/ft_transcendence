
from requests import post, get


class APIException(Exception):
    def __init__(self, message: str) -> None:
        self.message = message


def request(r_type: str,
            url: str,
            headers: dict | list = None,
            params: dict | list = None,
            body: dict | list = None) -> dict:
    if r_type == 'GET':
        response = get(url, headers=headers, params=params, json=body)
    elif r_type == 'POST':
        response = post(url, headers=headers, params=params, json=body)
    else:
        raise APIException(f'Invalid request type \'{r_type}\'')
    if response.status_code != 200:
        raise APIException(f'Request failed with status code \'{response.status_code}\'')
    return response.json()

