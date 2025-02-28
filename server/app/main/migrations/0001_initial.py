# Generated by Django 5.0.6 on 2025-01-11 23:44

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reference',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(max_length=120)),
                ('ref_type', models.TextField(choices=[('service', 'Service company'), ('client', 'Client'), ('machine_model', ' Machine model'), ('engine_model', 'Engine model'), ('transmission_model', 'Transmission model'), ('steerable_bridge_model', 'Steerable bridge model'), ('main_bridge_model', 'Main bridge model'), ('not_specified', 'not specified'), ('failure_node', 'Failure node'), ('recovery_method', 'Recovery method'), ('maintenance_type', 'Maintenance type')], default='not specified', max_length=120)),
                ('description', models.TextField(max_length=120)),
            ],
        ),
        migrations.CreateModel(
            name='MyUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('is_superuser', models.BooleanField(default=False)),
                ('date_joined', models.DateField(default=django.utils.timezone.now)),
                ('user_type', models.TextField(choices=[('client', 'Client'), ('service', 'Service company')], default='not specified', max_length=120)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
                ('user_ref', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.reference')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Machine',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('id_num', models.TextField(max_length=30)),
                ('engine_id', models.TextField(max_length=30)),
                ('transmission_id', models.TextField(max_length=30)),
                ('main_bridge_id', models.TextField(max_length=30)),
                ('steerable_bridge_id', models.TextField(max_length=30)),
                ('supply_contract_num_date', models.TextField(max_length=120)),
                ('shipment_date', models.DateField()),
                ('cargo_receiver', models.TextField(max_length=120)),
                ('supply_address', models.TextField(max_length=220)),
                ('equipment_add', models.TextField(max_length=220)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='machine_user', related_query_name='machines_user', to=settings.AUTH_USER_MODEL)),
                ('engine_model', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='engine_model', related_query_name='engine_models', to='main.reference')),
                ('main_bridge_model', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='main_bridge_model', related_query_name='main_bridge_models', to='main.reference')),
                ('model', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='model', related_query_name='models', to='main.reference')),
                ('steerable_bridge_model', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='steerable_bridge_model', related_query_name='steerable_bridge_models', to='main.reference')),
                ('transmission_model', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transmission_model', related_query_name='transmission_models', to='main.reference')),
            ],
        ),
        migrations.CreateModel(
            name='Reclamation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('refuse_date', models.DateField()),
                ('operating_time', models.TextField(max_length=120)),
                ('failure_description', models.TextField(max_length=220)),
                ('spare_parts_use', models.TextField(max_length=220)),
                ('recovery_date', models.DateField()),
                ('machine_downtime', models.DurationField(blank=True, default=None, null=True)),
                ('machine', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reclamation_machine', related_query_name='reclamation_machines', to='main.machine')),
                ('service_company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reclamation_user', related_query_name='reclamation_user', to=settings.AUTH_USER_MODEL)),
                ('failure_node', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='failure_node', related_query_name='failure_nodes', to='main.reference')),
                ('recovery_method', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recovery_method', related_query_name='recovery_methods', to='main.reference')),
            ],
        ),
        migrations.CreateModel(
            name='Maintenance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mt_date', models.DateField()),
                ('operating_time', models.IntegerField()),
                ('order_num', models.TextField(max_length=120)),
                ('order_date', models.DateField()),
                ('machine', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='maintenance_machine', related_query_name='maintenance_machines', to='main.machine')),
                ('service_company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='maintenance_user', related_query_name='maintenance_user', to=settings.AUTH_USER_MODEL)),
                ('type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='maintenance_type', related_query_name='maintenance_types', to='main.reference')),
            ],
        ),
    ]
