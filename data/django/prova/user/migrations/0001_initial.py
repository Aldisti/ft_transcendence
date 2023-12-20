# Generated by Django 5.0 on 2023-12-08 15:04

import django.core.validators
import django.db.models.deletion
import user.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('username', models.CharField(db_column='username', max_length=32, primary_key=True, serialize=False, validators=[django.core.validators.RegexValidator(regex='^[A-Za-z0-9!?*@$~_-]{5,32}$')])),
                ('password', models.CharField(db_column='password', max_length=72)),
                ('email', models.EmailField(db_column='email', max_length=320, unique=True, validators=[django.core.validators.EmailValidator()])),
                ('role', models.CharField(choices=[('A', 'Admin'), ('M', 'Mod'), ('U', 'User')], db_column='role', default='U', max_length=1)),
                ('active', models.BooleanField(db_column='active', db_comment='False when user is banned', default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='UserInfo',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='user_info', serialize=False, to='user.user')),
                ('first_name', models.CharField(blank=True, db_column='first_name', max_length=32, validators=[django.core.validators.RegexValidator(regex='^[A-Za-z -]{1,32}$')])),
                ('last_name', models.CharField(blank=True, db_column='last_name', max_length=32, validators=[django.core.validators.RegexValidator(regex='^[A-Za-z -]{1,32}$')])),
                ('birthdate', models.DateField(db_column='birthdate', null=True, validators=[user.validators.validate_birthdate])),
                ('date_joined', models.DateTimeField(auto_now_add=True, db_column='date_joined')),
                ('picture', models.FilePathField(db_column='picture', null=True, path='/tmp/images', recursive=True)),
            ],
        ),
    ]