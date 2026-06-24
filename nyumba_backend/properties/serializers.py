from rest_framework import serializers

from .models import Property


class PropertySerializer(
    serializers.ModelSerializer
):

    map_url = serializers.SerializerMethodField()

    class Meta:

        model = Property

        fields = [
            "id",
            "title",
            "description",
            "price",
            "location",
            "property_type",
            "latitude",
            "longitude",
            "status",
            "image",
            "map_url",
        ]

        read_only_fields = [
            "landlord"
        ]

        extra_kwargs = {
            "image": {
                "required": False
            }
        }

    def get_map_url(self, obj):

        return (
            f"https://www.google.com/maps?"
            f"q={obj.latitude},{obj.longitude}"
        )