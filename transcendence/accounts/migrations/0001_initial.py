# Generated by Django 5.0 on 2023-12-18 10:08

import accounts.validators
import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('username', models.CharField(db_column='username', max_length=32, primary_key=True, serialize=False, validators=[django.core.validators.RegexValidator(regex='^[A-Za-z0-9!?*$~_-]{5,32}$')])),
                ('email', models.EmailField(db_column='email', max_length=320, unique=True, validators=[django.core.validators.EmailValidator()])),
                ('role', models.CharField(choices=[('A', 'admin'), ('M', 'mod'), ('U', 'user')], db_column='role', default='U', max_length=1)),
                ('active', models.BooleanField(db_column='active', db_comment='False when user is banned', default=True)),
            ],
            options={
                'db_table': 'user',
            },
        ),
        migrations.CreateModel(
            name='UserInfo',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='user_info', serialize=False, to=settings.AUTH_USER_MODEL)),
                ('first_name', models.CharField(blank=True, db_column='first_name', max_length=32, validators=[django.core.validators.RegexValidator(regex='^[A-Za-z -]{1,32}$')])),
                ('last_name', models.CharField(blank=True, db_column='last_name', max_length=32, validators=[django.core.validators.RegexValidator(regex='^[A-Za-z -]{1,32}$')])),
                ('birthdate', models.DateField(blank=True, db_column='birthdate', null=True, validators=[accounts.validators.validate_birthdate])),
                ('date_joined', models.DateTimeField(auto_now_add=True, db_column='date_joined')),
                ('picture', models.FilePathField(blank=True, db_column='picture', null=True, path='/tmp/images', recursive=True)),
            ],
            options={
                'db_table': 'user_info',
            },
        ),
    ]
