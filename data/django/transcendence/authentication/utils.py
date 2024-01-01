
from random import SystemRandom
from base64 import b64encode

SPRING = SystemRandom()


def generate_token(size: int) -> str:
    return SPRING.randbytes(size).hex()
    # encoded = b64encode(SPRING.randbytes(size))
    # return str(encoded, encoding='utf-8')
