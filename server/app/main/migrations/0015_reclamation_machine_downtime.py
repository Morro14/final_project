# Generated by Django 5.0.6 on 2025-02-06 20:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0014_remove_reclamation_machine_downtime_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='reclamation',
            name='machine_downtime',
            field=models.DurationField(blank=True, editable=False, null=True),
        ),
    ]
