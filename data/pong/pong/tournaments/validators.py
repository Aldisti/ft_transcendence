from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible

import logging

logger = logging.getLogger()


@deconstructible
class ParticipantsValidator:

    def __init__(self, layers:int , message: str):
        self.layers = layers if layers > 1 else 2
        self.message = message
        self.valid_values = [2 ** value for value in range(2, self.layers + 1)]

    def __call__(self, value: int):
        if value not in self.valid_values:
            raise ValidationError(self.message)
