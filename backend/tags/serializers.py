from rest_framework import serializers
from .models import Tag


class TagSerializer(serializers.HyperlinkedModelSerializer):
    study_count = serializers.IntegerField(read_only=True)
    question_count = serializers.IntegerField(read_only=True)
    total_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Tag
        fields = ['name', 'is_public', 'study_count', 'question_count', 'total_count']
        # fields = '__all__'
