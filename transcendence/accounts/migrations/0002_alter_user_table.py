# Generated by Django 5.0 on 2023-12-20 14:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='user',
            table='user_auth',
        ),
    ]