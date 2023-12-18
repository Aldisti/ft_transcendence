from django.core.exceptions import ValidationError
from datetime import date

MIN_AGE = 14


def validate_birthdate(value):
    min_date = date.today()
    min_date = min_date.replace(year=(min_date.year - MIN_AGE))
    if value is None:
        return
    if not date(year=1900, month=1, day=1) < value < min_date:
        raise ValidationError(
            "Invalid birthdate",
        )