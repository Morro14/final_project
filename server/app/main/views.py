from urllib.parse import unquote

from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from django.http import Http404
from django.shortcuts import get_object_or_404
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Machine, Reference, Reclamation, Maintenance, MyUser
from .serializers import MachineSerializer, MachineRestrictedSerializer, ReferenceSerializer, ReclamationSerializer, \
    MaintenanceSerializer, MyUserSerializer, GroupSerializer


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
        name = unquote(self.kwargs["name"])
        return self.get_queryset().get(name=name)


ref_view = ReferenceViewSet.as_view({'get': 'retrieve'})
ref_view_list = ReferenceViewSet.as_view({'get': 'list'})


@extend_schema(tags=["maintenances"])
class MaintenanceViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer


mt_view = MaintenanceViewSet.as_view({'get': 'retrieve'})
mt_view_list = MaintenanceViewSet.as_view({'get': 'list'})


@extend_schema(tags=["Reclamations"])
class ReclamationViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    queryset = Reclamation.objects.all()
    serializer_class = ReclamationSerializer


reclamation_view = ReclamationViewSet.as_view({'get': 'retrieve'})
reclamation_view_list = ReclamationViewSet.as_view({'get': 'list'})


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


class ReclamationSetView(viewsets.ReadOnlyModelViewSet):
    queryset = Reclamation.objects.all()
    serializer_class = ReclamationSerializer


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def get_user(request):
    if request.method == 'GET':
        user = request.user

        groups = Group.objects.filter(user=user)
        groups_data = GroupSerializer(groups, many=True).data
        user_data = MyUserSerializer(user, context=groups).data
        user_data['groups'] = groups_data
        return Response({'user': user_data})


class AuthenticatedView(APIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request, category=None):
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
            ref_list = Reference.objects.all()
            ref_list = ref_list.order_by(sorting) if sorting and category == 'reference' else ref_list
            context = {
                'client': {'name': f'Manager {user.email}'},
                'machines': MachineSerializer(machine_list, many=True).data,
                'reclamations': ReclamationSerializer(reclamations_list, many=True).data,
                'maintenances': MaintenanceSerializer(mt_list, many=True).data,
                'references': ReferenceSerializer(ref_list, many=True).data
            }
            return Response(context)

        if user.is_authenticated:
            client = user.user_ref
            machine_list = Machine.objects.filter(client=client)
            machine_list = machine_list.order_by(sorting) if sorting and category == 'machines' else machine_list
            machine_ids = []
            for m in machine_list:
                machine_ids.append(m.id_num)
            reclamations_list = Reclamation.objects.filter(machine_id__id_num__in=machine_ids)
            reclamations_list = reclamations_list.order_by(
                sorting) if sorting and category == 'reclamations' else reclamations_list
            mt_list = Maintenance.objects.filter(machine__id_num__in=machine_ids)
            mt_list = mt_list.order_by(sorting) if sorting and category == 'maintenances' else mt_list
            context = {'client': ReferenceSerializer(client).data,
                       'machines': MachineSerializer(machine_list, many=True).data,
                       'reclamations': ReclamationSerializer(reclamations_list, many=True).data,
                       'maintenances': MaintenanceSerializer(mt_list, many=True).data}
            return Response(context)


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

        if category == "machine" and not user_manager:
            return Response(status=403, data={'text': 'No access'})

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
                {'user_ref': user_ref,
                 'ref': ReferenceSerializer(machine_ref, many=True).data
                 }
            )
        elif category == 'maintenance':
            ref_types = ['service_company', 'maintenance_type']
            maintenance_ref = Reference.objects.filter(ref_type__in=ref_types)
            if user_type == 'client':
                machines = Machine.objects.filter(client=user.user_ref)
            if user_type == 'service':
                machines = Machine.objects.filter(service_company=user.user_ref)
            if user_type == 'Manager':
                machines = Machine.objects.all()
            return Response(
                {'user_ref': user_ref,
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
                {'user_ref': user_ref,
                 'ref': ReferenceSerializer(reclamation_ref, many=True).data,
                 'machines': MachineSerializer(machines, many=True).data
                 }
            )
        else:
            return Response(status=400, data={'text': 'Bad request'})

    def post(self, request, category):
        user = request.user
        user_manager = user.groups.filter(name='Manager').exists()
        data = request.data
        data_new = dict(data)

        if category == 'reference':
            if user_manager:
                serializer = ReferenceSerializer(data=data_new)
                serializer.is_valid()

                if serializer.is_valid():
                    serializer.save()
                    return Response(status=200, data={'text': 'Data has been added'})
                else:
                    return Response(status=400, data={'text': 'invalid data'})
            else:
                return Response(status=403, data={'text': 'No access'})

        if category == 'machine':
            if not user_manager:
                return Response(status=403, data={'text': 'No access'})
            serializer = MachineSerializer(data=data_new)
            serializer.is_valid()
            if serializer.is_valid():
                serializer.save()
                return Response(status=200, data={'text': 'Data has been added'})
            else:
                return Response(status=406, data={'text': 'invalid data'})

        if category == 'reclamation':
            serializer = ReclamationSerializer(data=data_new)
            serializer.is_valid()
            if serializer.is_valid():
                serializer.save()
                return Response(status=200, data={'text': 'Data has been added'})
            else:
                return Response(status=406, data={'text': 'invalid data'})

        if category == 'maintenance':
            serializer = MaintenanceSerializer(data=data_new)
            serializer.is_valid()
            if serializer.is_valid():
                serializer.save()
                return Response(status=200, data={'text': 'Data has been added'})
            else:
                return Response(status=406, data={'text': 'invalid data'})

    def patch(self, request, *args, **kwargs):
        data = request.data
        name_prev = data.pop('name_prev')
        user = request.user
        user_manager = user.groups.filter(name='Manager').exists()
        ref = Reference.objects.get(name=name_prev)

        if user_manager and ref:
            data['pk'] = ref.pk
            serializer = ReferenceSerializer(data=data)
            serializer.is_valid()
            if serializer.is_valid():
                serializer.save()
                return Response(status=200, data={'text': 'Data has been added'})
            else:
                return Response(status=406, data={'text': 'invalid data'})
        else:
            return Response(status=403, data={'text': 'No access'})
