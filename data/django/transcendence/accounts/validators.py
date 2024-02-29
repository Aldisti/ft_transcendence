from django.core.exceptions import ValidationError
from django.conf import settings
from datetime import date, timedelta

import logging

logger = logging.getLogger()


def validate_birthdate(value):
    min_date = date.today()
    min_date = min_date - timedelta(days=round(365.25 * settings.MIN_AGE))
    if not date(year=1900, month=1, day=1) < value < min_date:
        raise ValidationError(
            "Invalid birthdate",
        )


def image_validator(file) -> bool:

    # size check
    # logger.warning(f"file.size: {file.size}")
    if file.size >= settings.MAX_SIZE:
        raise ValidationError("Invalid file size")

    # length name check
    # logger.warning(f"file.name: {file.name}")
    if len(file.name) >= settings.MAX_NAME_LEN:
        raise ValidationError("Invalid file size")

    # ext check
    # logger.warning(f"file.name: {file.name}")
    try:
        ext = file.name[1 + file.name.rindex("."):].lower()
    except ValueError:
        raise ValidationError("invalid file ext")
    # logger.warning(f"ext: {ext}")
    if ext not in settings.ALLOWED_EXT:
        raise ValidationError("invalid file ext")

    # type check
    content_type = file.content_type
    # logger.warning(f"file.content_type: {content_type}")
    if not content_type.startswith(settings.FILE_CATEGORY):
        raise ValidationError("invalid file type")
    try:
        pure_type = content_type[1 + content_type.rindex("/"):].lower()
    except ValueError:
        raise ValidationError("invalid file type")
    # logger.warning(f"pure_type: {pure_type}")
    if pure_type not in settings.ALLOWED_TYPES:
        raise ValidationError("invalid file type")
