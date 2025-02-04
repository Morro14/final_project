from django.contrib.auth.models import Group
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import Machine, Maintenance, Reclamation, Reference, MyUser

types = {
    'service_company': 'Service company',
    'client': 'Client',
    'machine_model': ' Machine model',
    'engine_model': 'Engine model',
    'transmission_model': 'Transmission model',
    'steerable_bridge_model': 'Steerable bridge model',
    'main_bridge_model': 'Main bridge model',
    'not_specified': 'not specified',
    'failure_node': 'Failure node',
    'recovery_method': 'Recovery method',
    'maintenance_type': 'Maintenance type'

}
choices = list(types.keys())


class ReferenceSerializer(serializers.ModelSerializer):
    ref_type = serializers.ChoiceField(choices=choices)

    def create(self, validated_data):
        ref = Reference(**validated_data)
        ref.save()
        return ref

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

    id_num = serializers.CharField(validators=[UniqueValidator(queryset=Machine.objects.all())])

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
                  ]


class ReclamationSerializer(serializers.ModelSerializer):
    failure_node = serializers.SlugRelatedField(slug_field="name", queryset=Reference.objects.all())
    recovery_method = serializers.SlugRelatedField(slug_field="name", queryset=Reference.objects.all())
    service_company = serializers.SlugRelatedField(slug_field="name", queryset=Reference.objects.all())
    machine = serializers.SlugRelatedField(slug_field="id_num", queryset=Machine.objects.all())
    machine_downtime = serializers.CharField(source="get_downtime", read_only=True)
    refuse_date = serializers.DateTimeField()
    recovery_date = serializers.DateTimeField()

    def create(self, validated_data):
        rec = Reclamation(**validated_data)
        rec.save()
        return rec

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
    type = serializers.SlugRelatedField(slug_field="name", queryset=Reference.objects.all())

    machine = serializers.SlugRelatedField(slug_field="id_num", queryset=Machine.objects.all())
    service_company = serializers.SlugRelatedField(slug_field="name", queryset=Reference.objects.all())
    mt_company = serializers.SlugRelatedField(slug_field="name", queryset=Reference.objects.all())

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
    name = serializers.CharField()

    class Meta:
        model = Group
        fields = ['name']


class DateSerializer(serializers.Serializer):
    date = serializers.DateField()


class DateTimeSerializer(serializers.Serializer):
    date = serializers.DateTimeField()


class MyUserSerializer(serializers.ModelSerializer):
    user_ref = serializers.SlugRelatedField(slug_field="name", queryset=Reference.objects.all())

    class Meta:
        model = MyUser
        fields = ['email', 'user_type', 'user_ref']
