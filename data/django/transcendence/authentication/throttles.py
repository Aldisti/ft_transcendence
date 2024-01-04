
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


# AnonRateThrottle for anonymous users
# UserRateThrottle for authenticated users
# SimpleRateThrottle to make a custom throttle (from zero)

class AnonAuthThrottle(AnonRateThrottle):
    scope = 'auth'


class UserAuthThrottle(UserRateThrottle):
    scope = 'auth'
