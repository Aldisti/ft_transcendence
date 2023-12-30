# Generated by Django 5.0 on 2023-12-30 09:25

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserTokens',
            fields=[
                ('user', models.OneToOneField(db_column='username', on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='user_tokens', serialize=False, to=settings.AUTH_USER_MODEL)),
                ('email_token', models.CharField(blank=True, db_column='email_token', default='', max_length=36)),
            ],
            options={
                'db_table': 'user_tokens',
            },
        ),
    ]
