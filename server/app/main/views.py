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
from rest_framework.exceptions import AuthenticationFailed


# Create your views here.


class MachineViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = [TokenAuthentication]
    queryset = Machine.objects.all()
    lookup_field = "id_num"

    def get_serializer_class(self):
        return MachineSerializer


class MachineRestrictedViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = []
    queryset = Machine.objects.all()
    lookup_field = "id_num"

    def get_serializer_class(self):
        return MachineRestrictedSerializer


machine_details = MachineViewSet.as_view({"get": "retrieve"})
machine_list = MachineViewSet.as_view({"get": "list"})

machine_restricted_details = MachineRestrictedViewSet.as_view({"get": "retrieve"})
machine_restricted_list = MachineRestrictedViewSet.as_view({"get": "list"})


class ReferenceView(APIView):
    def get(self, request, name):

        try:
            ref_object = get_object_or_404(Reference, name=name)
        except Reference.DoesNotExist:
            raise Http404("Given query not found")
        ref_serializer = ReferenceSerializer(ref_object)
        return Response(ref_serializer.data)


class ReferencesView(APIView):
    def get(self, request):
        # queryset = Reference.objects.all()
        queryset = Reference.objects.exclude(ref_type__in=['client', 'service'])
        print(queryset)
        serializer = ReferenceSerializer(queryset, many=True)
        return Response(serializer.data)


class TestView(APIView):
    def get(self, request, id):
        ref_object = Reference.objects.get(id=id)
        ref_serialized = ReferenceSerializer(ref_object)
        return Response(ref_serialized.data)


class AuthView(APIView):
    def post(self, request):
        print(request.data)
        user = authenticate(email=request.data["email"], password=request.data["password"])
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            print('user is authenticated')
            return Response({"email": user.email, 'token': token.key})

        else:
            print('user is not authenticated')

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
    print('authenticated_view')
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


    def get(self, request, category, sorting):
        try:
            user = get_object_or_404(MyUser, email=request.user)
            # print(user.has_perm('main.view_machine'))
            # print(user.has_perm('main.view_reclamation'))
            # print(user.has_perm('main.view_reference'))
            client = user.user_ref
        except MyUser.DoesNotExist:
            raise Http404("Access error")

        if user.is_authenticated:
            machine_list = Machine.objects.filter(client=client)
            print('client', client)
            print('machine_list', machine_list)
            machine_ids = []
            for m in machine_list:
                machine_ids.append(m.id_num)

            if category == "machines":
                if sorting != "undefined":
                    machine_list.order_by(sorting)
                return Response({'sorted_list': MachineSerializer(machine_list, many=True).data})

            elif category == "maintenances":
                mt_list = Maintenance.objects.filter(machine__id_num__in=machine_ids)
                if sorting != "undefined":
                    mt_list = mt_list.order_by(sorting)
                return Response({'sorted_list': MaintenanceSerializer(mt_list, many=True).data})

            elif category == "reclamations":
                reclamations_list = Reclamation.objects.filter(machine_id__id_num__in=machine_ids)
                if sorting != "undefined":
                    reclamations_list = reclamations_list.order_by(sorting)
                return Response({'sorted_list': ReclamationSerializer(reclamations_list, many=True).data})

class CreateView(APIView):



    def post(self, request, category):
        print(request.data)



