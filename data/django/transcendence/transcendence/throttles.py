
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


# AnonRateThrottle for anonymous users
# UserRateThrottle for authenticated users
# SimpleRateThrottle to make a custom throttle (from zero)

class AnonAuthThrottle(AnonRateThrottle):
    scope = 'auth'


class UserAuthThrottle(UserRateThrottle):
    scope = 'auth'


class AuthThrottle(UserRateThrottle):
    scope = 'auth'


class HighLoadThrottle(UserRateThrottle):
    scope = 'high_load'


class MediumLoadThrottle(UserRateThrottle):
    scope = 'medium_load'


class LowLoadThrottle(UserRateThrottle):
    scope = 'low_load'


class EmailThrottle(UserRateThrottle):
    scope = 'email'
