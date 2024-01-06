# Generated by Django 5.0 on 2024-01-05 11:00

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('two_factor_auth', '0002_alter_usertwofactorauth_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usertwofactorauth',
            name='token',
        ),
        migrations.AddField(
            model_name='usertwofactorauth',
            name='otp_token',
            field=models.CharField(db_column='otp_token', default='', max_length=32, unique=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='usertwofactorauth',
            name='url_token',
            field=models.CharField(blank=True, db_column='url_token', default='', max_length=36, validators=[django.core.validators.MinLengthValidator(36, message='too short token')]),
        ),
    ]
