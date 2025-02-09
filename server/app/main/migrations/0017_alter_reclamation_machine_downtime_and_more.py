# Generated by Django 5.0.6 on 2025-02-06 21:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0016_alter_reclamation_recovery_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reclamation',
            name='machine_downtime',
            field=models.PositiveIntegerField(blank=True, editable=False, null=True),
        ),
        migrations.AlterField(
            model_name='reclamation',
            name='recovery_date',
            field=models.DateTimeField(),
        ),
    ]
