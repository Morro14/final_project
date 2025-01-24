# Generated by Django 5.0.6 on 2025-01-19 17:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0007_machine_service_company'),
    ]

    operations = [
        migrations.AlterField(
            model_name='machine',
            name='client',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='machine_client', related_query_name='machine_clients', to='main.reference'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='service_company',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='machine_service', related_query_name='machine_services', to='main.reference'),
        ),
        migrations.AlterField(
            model_name='reference',
            name='description',
            field=models.TextField(max_length=360),
        ),
    ]
