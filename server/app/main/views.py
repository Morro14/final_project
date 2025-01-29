from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveAPIView
from rest_framework.mixins import ListModelMixin
from rest_framework.response import Response

from rest_framework.views import APIView

from .models import Machine, Reference, Reclamation, Maintenance, MyUser

from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

from rest_framework import viewsets
from .serializers import MachineSerializer, MachineRestrictedSerializer, ReferenceSerializer, ReclamationSerializer, \
    MaintenanceSerializer
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from django.http import Http404
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes


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
            return Response({'error': 'Invalid credentials'})


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


class AuthenticatedView(APIView):

    authentication_classes = [TokenAuthentication]

    def get(self, request):
        # print(request.data)
        try:
            user = get_object_or_404(MyUser, email=request.user)

        except MyUser.DoesNotExist:
            raise Http404("Access error")

        if user.is_authenticated:
            client = user.user_ref
            machine_list = Machine.objects.filter(client=client)
            machine_ids = []
            for m in machine_list:
                machine_ids.append(m.id_num)
            reclamations_list = Reclamation.objects.filter(machine_id__id_num__in=machine_ids)
            mt_list = Maintenance.objects.filter(machine__id_num__in=machine_ids)
            context = {'client': ReferenceSerializer(client).data,
                       'machine_list': MachineSerializer(machine_list, many=True).data,
                       'reclamations_list': ReclamationSerializer(reclamations_list, many=True).data,
                       'mt_list': MaintenanceSerializer(mt_list, many=True).data}
            return Response(context)


class SortedView(APIView):

    authentication_classes = [TokenAuthentication]


    def get(self, request, category, **kwargs):
        print(category, kwargs)

        sorting = kwargs['sorting'] if 'sorting' in kwargs else None

        try:
            user = get_object_or_404(MyUser, email=request.user)

            client = user.user_ref
        except MyUser.DoesNotExist:
            raise Http404("Access error")

        if user.is_authenticated:

            machine_list = Machine.objects.filter(client=client)

            machine_ids = []
            for m in machine_list:
                machine_ids.append(m.id_num)

            if category == "machines":
                if sorting:
                    machine_list.order_by(sorting)
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
    # def get(self, request, category):
    authentication_classes = [TokenAuthentication]
    def post(self, request, category):

        print(category, request.data)
        data = request.data
        print(Reference.objects.filter(ref_type='service'))
        service_company = Reference.objects.get(name=data['service_company'])
        print(service_company)
        # entity_data = {
        #     'service_company' : data.service_company,
        #     'machine': data.machine,
        #     'service_company': data.service_company,
        #     'service_company': data.service_company,
        #     'service_company': data.service_company,
        # }





