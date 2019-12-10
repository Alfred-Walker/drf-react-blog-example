from rest_framework import serializers
from .models import Study


class StudySerializers(serializers.ModelSerializer):
    class Meta:
        model = Study
        fields = '__all__'
