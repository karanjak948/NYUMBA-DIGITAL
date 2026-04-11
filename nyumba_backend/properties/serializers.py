from rest_framework import serializers
from .models import Property

class PropertySerializer(serializers.ModelSerializer):
    map_url = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = '__all__'
        read_only_fields = ['landlord']


    def get_map_url(self, obj):
        return f"https://www.google.com/maps?q={obj.latitude},{obj.longitude}"