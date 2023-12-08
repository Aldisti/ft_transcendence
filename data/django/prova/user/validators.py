from django.core.exceptions import ValidationError
from datetime import date

def validate_birthdate(value):
    if not date(year=1900, month=1, day=1) < value < date.today():
        raise ValidationError(
            "Invalid birthdate",
        )
