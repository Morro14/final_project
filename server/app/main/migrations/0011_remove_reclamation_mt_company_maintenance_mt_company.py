# Generated by Django 5.0.6 on 2025-01-29 07:20

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0010_reclamation_mt_company_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='reclamation',
            name='mt_company',
        ),
        migrations.AddField(
            model_name='maintenance',
            name='mt_company',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='mt_company_ref', related_query_name='mt_companies_ref', to='main.reference'),
        ),
    ]
