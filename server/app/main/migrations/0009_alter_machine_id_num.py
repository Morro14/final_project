# Generated by Django 5.0.6 on 2025-01-27 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0008_alter_machine_client_alter_machine_service_company_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='machine',
            name='id_num',
            field=models.TextField(max_length=30, unique=True),
        ),
    ]
