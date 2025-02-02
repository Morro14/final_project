from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import Machine, Maintenance, Reclamation, Reference
from django.contrib.auth.models import Group
from django.urls import resolve
from urllib.parse import unquote

class ReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reference
        fields = "__all__"

class MachineSerializer(serializers.ModelSerializer):
    client = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Reference.objects.all()
    )
    model = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Reference.objects.all()
    )
    engine_model = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Reference.objects.all()
    )
    transmission_model = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Reference.objects.all()
    )
    main_bridge_model = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Reference.objects.all()
    )
    steerable_bridge_model = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Reference.objects.all()
    )
    service_company = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Reference.objects.all()
    )
    id_num = serializers.CharField(validators=[UniqueValidator(queryset=Machine.objects.all())])
    # sorting_fields = serializers.SerializerMethodField()
    @extend_schema_field({'type': 'array', 'items': {'type', 'string'}})
    def get_sorting_fields(self, obj):
        sorting_fields_dict = ['model', 'engine_model', 'transmission_model', 'main_bridge_model',
                               'steerable_bridge_model', 'id_num', ]
        sorting_field = sorting_fields_dict
        return sorting_field

    def create(self, validated_data):
        machine = Machine(**validated_data)
        machine.save()
        return machine

    class Meta:
        model = Machine
        fields = ['id',
                  'id_num',
                  'model',
                  'engine_model',
                  'engine_id',
                  'transmission_model',
                  'transmission_id',
                  'main_bridge_model',
                  'main_bridge_id',
                  'steerable_bridge_model',
                  'steerable_bridge_id',
                  'supply_contract_num_date',
                  'shipment_date',
                  'cargo_receiver',
                  'supply_address',
                  'equipment_add',
                  'client',
                  'service_company',

                  ]


class MachineRestrictedSerializer(serializers.ModelSerializer):
    model = ReferenceSerializer()
    engine_model = ReferenceSerializer()
    transmission_model = ReferenceSerializer()
    main_bridge_model = ReferenceSerializer()
    steerable_bridge_model = ReferenceSerializer()
    sorting_fields = serializers.SerializerMethodField()

    class Meta:
        model = Machine
        fields = ['id',
                  'id_num',
                  'model',
                  'engine_model',
                  'engine_id',
                  'transmission_model',
                  'transmission_id',
                  'main_bridge_model',
                  'main_bridge_id',
                  'steerable_bridge_model',
                  'steerable_bridge_id',
                  'sorting_fields']

    def get_sorting_fields(self, obj):
        sorting_fields_dict = ['model', 'engine_model', 'transmission_model', 'main_bridge_model',
                               'steerable_bridge_model', 'id_num', ]
        sorting_field = sorting_fields_dict
        return sorting_field





class ReclamationSerializer(serializers.ModelSerializer):
    failure_node = ReferenceSerializer()
    recovery_method = ReferenceSerializer()
    service_company = ReferenceSerializer()
    machine = MachineRestrictedSerializer()
    # machine_name = serializers.CharField(source="get_machine_name")
    machine_downtime = serializers.CharField(source="get_downtime")
    # machine_id = serializers.CharField(source="get_machine_id")
    refuse_date = serializers.DateTimeField(format='iso-8601')

    class Meta:
        model = Reclamation
        fields = [
            'id',
            'refuse_date',
            'operating_time',
            'failure_node',
            'failure_description',
            'recovery_method',
            'spare_parts_use',
            'recovery_date',
            'machine_downtime',
            'machine',

            'service_company'
        ]


class MaintenanceSerializer(serializers.ModelSerializer):

    type = ReferenceSerializer()

    machine = MachineRestrictedSerializer()
    service_company = ReferenceSerializer()
    mt_company = ReferenceSerializer()

    # machine_id = serializers.CharField(source="get_machine_id")
    # machine_name = serializers.CharField(source="get_machine_name")

    class Meta:
        model = Maintenance
        fields = [
            'id',
            'type',
            'mt_date',
            'operating_time',
            'order_num',
            'order_date',
            'machine',
            'service_company',
            'mt_company',

        ]
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name']



class DateSerializer(serializers.Serializer):
    date = serializers.DateField()
