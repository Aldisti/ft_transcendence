
from rest_framework.throttling import UserRateThrottle


# AnonRateThrottle for anonymous users
# UserRateThrottle for authenticated users
# SimpleRateThrottle to make a custom throttle (from zero)


class HighLoadThrottle(UserRateThrottle):
    scope = 'high_load'


class MediumLoadThrottle(UserRateThrottle):
    scope = 'medium_load'


class LowLoadThrottle(UserRateThrottle):
    scope = 'low_load'
