
from rest_framework import serializers

date='1/14/2022'
class DateSerializer(serializers.Serializer):
    date = serializers.DateField()
ser = DateSerializer(data={'date': date})

print(ser.is_valid())