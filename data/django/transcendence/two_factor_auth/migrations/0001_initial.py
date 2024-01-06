# Generated by Django 5.0 on 2024-01-04 18:23

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0002_alter_userinfo_picture'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserTwoFactorAuth',
            fields=[
                ('user', models.OneToOneField(db_column='user', on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='user_tfa', serialize=False, to=settings.AUTH_USER_MODEL)),
                ('token', models.CharField(db_column='token', max_length=32, unique=True)),
                ('type', models.CharField(choices=[('SW', 'SOFTWARE'), ('EM', 'EMAIL')], db_column='type', max_length=2)),
            ],
            options={
                'db_table': 'user_tfa',
            },
        ),
    ]
