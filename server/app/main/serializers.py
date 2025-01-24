from rest_framework import serializers
from .models import Machine, Maintenance, Reclamation, Reference
from rest_framework import permissions


class MachineSerializer(serializers.ModelSerializer):
    client = serializers.SlugRelatedField(
        slug_field='name',
        read_only=True
    )
    model = serializers.SlugRelatedField(
        slug_field='name',
        read_only=True
    )
    engine_model = serializers.SlugRelatedField(
        slug_field='name',
        read_only=True
    )
    transmission_model = serializers.SlugRelatedField(
        slug_field='name',
        read_only=True
    )
    main_bridge_model = serializers.SlugRelatedField(
        slug_field='name',
        read_only=True
    )
    steerable_bridge_model = serializers.SlugRelatedField(
        slug_field='name',
        read_only=True
    )
    service_company = serializers.SlugRelatedField(
        slug_field='name',
        read_only=True
    )

    sorting_fields = serializers.SerializerMethodField()
    def get_sorting_fields(self, obj):
        sorting_fields_dict = ['model', 'engine_model', 'transmission_model', 'main_bridge_model',
                               'steerable_bridge_model', 'id_num', ]
        sorting_field = sorting_fields_dict
        return sorting_field
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
                  'sorting_fields'
                  ]


class MachineRestrictedSerializer(serializers.ModelSerializer):
    model = serializers.SlugRelatedField(
        slug_field='name',
        read_only=True
    )

    engine_model = serializers.SlugRelatedField(
        slug_field='name',
        read_only=True
    )

    transmission_model = serializers.SlugRelatedField(
        slug_field='name',
        read_only=True
    )

    main_bridge_model = serializers.SlugRelatedField(
        slug_field='name',
        read_only=True
    )

    steerable_bridge_model = serializers.SlugRelatedField(
        slug_field='name',
        read_only=True
    )

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


class ReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reference
        fields = "__all__"


class ReclamationSerializer(serializers.ModelSerializer):
    failure_node = serializers.SlugRelatedField(slug_field='name', read_only=True)
    recovery_method = serializers.SlugRelatedField(slug_field='name', read_only=True)
    service_company = serializers.SlugRelatedField(slug_field='name', read_only=True)
    machine_name = serializers.CharField(source="get_machine_name")
    machine_downtime = serializers.CharField(source="get_downtime")
    machine_id = serializers.CharField(source="get_machine_id")

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
            'machine_name',
            'machine_id',
            'service_company'
        ]


class MaintenanceSerializer(serializers.ModelSerializer):
    type = serializers.SlugRelatedField(slug_field='name', read_only=True)
    machine = serializers.SlugRelatedField(slug_field='id_num', read_only=True)
    service_company = serializers.SlugRelatedField(slug_field='name', read_only=True)

    machine_id = serializers.CharField(source="get_machine_id")
    machine_name = serializers.CharField(source="get_machine_name")

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
            'machine_name',
            'machine_id',
        ]
