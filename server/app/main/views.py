from rest_framework.decorators import action, api_view, authentication_classes
from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.metadata import *
from rest_framework.views import APIView
from .utils import types

from .models import Machine, Reference, Reclamation, Maintenance, MyUser

from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

from rest_framework import viewsets
from .serializers import MachineSerializer, MachineRestrictedSerializer, ReferenceSerializer, ReclamationSerializer, \
    MaintenanceSerializer, GroupSerializer, DateSerializer
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from django.http import Http404
from urllib.parse import unquote
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from rest_framework import mixins



# Create your views here.

@extend_schema(tags=["Machines"])
class MachineViewSet(viewsets.ModelViewSet):

    authentication_classes = [TokenAuthentication]
    queryset = Machine.objects.all()
    lookup_field = "id_num"
    serializer_class = MachineSerializer




@extend_schema(tags=["Machines"])
class MachineRestrictedView(RetrieveAPIView):
    authentication_classes = []
    queryset = Machine.objects.all()
    lookup_field = "id_num"
    serializer_class = MachineRestrictedSerializer

@extend_schema(tags=["References"])
class ReferenceViewSet(viewsets.ModelViewSet):
    authentication_classes = []
    queryset = Reference.objects.all()
    lookup_field = "name"
    serializer_class = ReferenceSerializer

    def get_object(self):
        name = unquote(self.kwargs["name"])  # Декодируем обратно
        print('unquote', name)
        return self.get_queryset().get(name=name)

ref_view = ReferenceViewSet.as_view({'get': 'retrieve'})
ref_view_list = ReferenceViewSet.as_view({'get': 'list'})

@extend_schema(
    parameters=[
        OpenApiParameter('email', OpenApiTypes.EMAIL, required=True, description='Users email'),
        OpenApiParameter('password', OpenApiTypes.PASSWORD, required=True, description='Users password'),

    ]
)
class AuthView(APIView):
    def post(self, request):
        user = authenticate(email=request.data["email"], password=request.data["password"])
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"email": user.email, 'token': token.key})
        else:
            return Response(status=401)


class ReclamationView(APIView):
    def get(self, request, id_):
        try:
            rec_object = get_object_or_404(Reclamation, id=id_)
        except Reclamation.DoesNotExist:
            raise Http404("Given query not found")

        rec_serialized = ReclamationSerializer(rec_object)
        return Response(rec_serialized.data)


class ReclamationsView(APIView):
    def get(self, request):
        rec_query = Reclamation.objects.all()
        rec_serialized = ReclamationSerializer(rec_query, many=True, )

        return Response(rec_serialized.data)


class ReclamationSetView(viewsets.ReadOnlyModelViewSet):
    queryset = Reclamation.objects.all()
    serializer_class = ReclamationSerializer

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def get_client_name(request):
    if request.method == 'GET':
        user = request.user
        client = user.user_ref
        if client:
            client = ReferenceSerializer(user.user_ref).data
        else:
            client = {'name': user.email}
        groups = GroupSerializer(user.groups.all(), many=True).data
        client['groups'] = groups
        return Response({'client': client})


class AuthenticatedView(APIView):
    authentication_classes = [TokenAuthentication]


    def get(self, request, category=None):
        # print(request.data)
        sorting = request.GET.get('sorting')

        try:
            user = get_object_or_404(MyUser, email=request.user)

        except MyUser.DoesNotExist:
            raise Http404("Access error")

        if user.groups.filter(name="Manager"):
            machine_list = Machine.objects.all()
            machine_list = machine_list.order_by(sorting) if sorting and category == 'machines' else machine_list
            reclamations_list = Reclamation.objects.all()
            reclamations_list = reclamations_list.order_by(
                sorting) if sorting and category == 'reclamations' else reclamations_list
            mt_list = Maintenance.objects.all()
            mt_list = mt_list.order_by(sorting) if sorting and category == 'maintenances' else mt_list
            context = {'client': {'name': f'Manager {user.email}'},
                       'machines': MachineSerializer(machine_list, many=True).data,
                       'reclamations': ReclamationSerializer(reclamations_list, many=True).data,
                       'maintenances': MaintenanceSerializer(mt_list, many=True).data}
            return Response(context)
        if user.is_authenticated:
            client = user.user_ref
            machine_list = Machine.objects.filter(client=client)
            machine_list = machine_list.order_by(sorting) if sorting and category == 'machines' else machine_list
            machine_ids = []
            for m in machine_list:
                machine_ids.append(m.id_num)
            reclamations_list = Reclamation.objects.filter(machine_id__id_num__in=machine_ids)
            reclamations_list = reclamations_list.order_by(sorting) if sorting and category == 'reclamations' else reclamations_list
            mt_list = Maintenance.objects.filter(machine__id_num__in=machine_ids)
            mt_list = mt_list.order_by(sorting) if sorting and category == 'maintenances' else mt_list
            context = {'client': ReferenceSerializer(client).data,
                       'machines': MachineSerializer(machine_list, many=True).data,
                       'reclamations': ReclamationSerializer(reclamations_list, many=True).data,
                       'maintenances': MaintenanceSerializer(mt_list, many=True).data}
            return Response(context)


class SortedView(APIView):

    authentication_classes = [TokenAuthentication]


    def get(self, request, category):
        sorting = request.GET.get("sorting", None)
        user = request.user

        print(sorting)
        if user.groups.filter(name="Manager"):
            machine_list = Machine.objects.all()
            reclamations_list = Reclamation.objects.all()
            mt_list = Maintenance.objects.all()
            context = {'client': {'name': f'Manager {user.email}'},
                       'machines': MachineSerializer(machine_list, many=True).data,
                       'reclamations': ReclamationSerializer(reclamations_list, many=True).data,
                       'maintenances': MaintenanceSerializer(mt_list, many=True).data}
            return Response(context)


        machine_list = Machine.objects.filter(client=client)
        machine_ids = []
        for m in machine_list:
            machine_ids.append(m.id_num)
        if category == "machines":
            if sorting:
                machine_list.order_by(sorting)
            if filter:
                machine_list.filter()
            return Response({'sorted_list': MachineSerializer(machine_list, many=True).data})
        elif category == "maintenances":
            mt_list = Maintenance.objects.filter(machine__id_num__in=machine_ids)
            if sorting:
                mt_list = mt_list.order_by(sorting)
            return Response({'sorted_list': MaintenanceSerializer(mt_list, many=True).data})
        elif category == "reclamations":
            reclamations_list = Reclamation.objects.filter(machine_id__id_num__in=machine_ids)
            if sorting:
                reclamations_list = reclamations_list.order_by(sorting)
            return Response({'sorted_list': ReclamationSerializer(reclamations_list, many=True).data})

class CreateView(APIView):
    authentication_classes = [TokenAuthentication]
    def get(self, request, category=None):
        user = request.user
        user_manager = user.groups.filter(name='Manager').exists()
        if not user_manager:
            user_type = user.user_ref.ref_type
            user_ref = ReferenceSerializer(user.user_ref).data
        else:
            user_type = 'Manager'
            user_ref = {'ref_type': 'Manager'}
        if category == 'machine' and user_manager:
            ref_types = ['service_company',
        'machine_model',
        'engine_model',
        'transmission_model',
        'steerable_bridge_model',
        'main_bridge_model',
                         'client']
            machine_ref = Reference.objects.filter(ref_type__in=ref_types)
            return Response(
                {   'user_ref': user_ref,
                    'ref': ReferenceSerializer(machine_ref, many=True).data
                }
            )
        elif category =='maintenance':
            ref_types = ['service_company','maintenance_type']
            maintenance_ref = Reference.objects.filter(ref_type__in=ref_types)
            if user_type == 'client':
                machines = Machine.objects.filter(client=user.user_ref)
            if user_type == 'service':
                machines = Machine.objects.filter(service_company=user.user_ref)
            if user_type == 'Manager':
                machines = Machine.objects.all()

            return Response(
                {   'user_ref': ReferenceSerializer(user_ref).data,
                    'ref': ReferenceSerializer(maintenance_ref, many=True).data,
                    'machines': MachineSerializer(machines, many=True).data
                }
            )
        elif category == 'reclamation':
            ref_types = ['service_company', 'failure_node', 'recovery_method']

            reclamation_ref = Reference.objects.filter(ref_type__in=ref_types)
            if user_type == 'client':
                machines = Machine.objects.filter(client=user.user_ref)
            if user_type == 'service':
                machines = Machine.objects.filter(service_company=user.user_ref)
            if user_type == 'Manager':
                machines = Machine.objects.all()

            return Response(
                {   'user_ref': ReferenceSerializer(user_ref).data,
                    'ref': ReferenceSerializer(reclamation_ref, many=True).data,
                    'machines': MachineSerializer(machines, many=True).data
                }
            )

    def post(self, request, category):
        data = request.data
        data_new = dict(data)
        # if data_new['model']:
        #     data_new['machine_model'] = data_new['model']
        #     data_new.pop('model')
        # for e in data:
        #
        #
        #     if e in ref_types:
        #
        #         ref = Reference.objects.get(name=data[e])
        #
        #         if ref:
        #             ref_rep = ReferenceSerializer(ref).data
        #             data_with_refs[e] = ref
        #             data_new[e] = ref_rep

        print('data new', data_new)

        if category == 'machine':
            # debug

            serializer = MachineSerializer(data=data_new)
            serializer.is_valid()
            print('errors',serializer.errors)
            if serializer.is_valid():
                serializer.save()
                return Response(status=200, data={'success': 'true'})
            else:
                return Response(status=406)




