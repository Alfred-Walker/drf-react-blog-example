from rest_framework import serializers
from .models import Study
from tags.models import Tag
from tags.serializers import TagSerializer
from pprint import pprint


class StudySerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='study-detail')
    tags = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name', allow_null=True)

    class Meta:
        model = Study
        fields = [
            'user',
            'id',
            'url',
            'title',
            'body',
            'tags',
            'review_cycle_in_minute',
            'notification_enabled',
            'is_public'
        ]

    def __init__(self, *args, **kwargs):
        super(StudySerializer, self).__init__(*args, **kwargs)
        pprint(kwargs)

    def create(self, validated_data):
        user = None
        request = self.context.get("request")

        if request and hasattr(request, "user"):
            user = request.user

        if request and hasattr(request, "review_cycle_in_minute"):
            study = Study.objects.create(
                user=user,
                title=validated_data['title'],
                body=validated_data['body'],
                review_cycle_in_minute=validated_data['review_cycle_in_minute'],
                notification_enabled=validated_data['notification_enabled'],
                is_public=validated_data['is_public'],
            )
        else:
            study = Study.objects.create(
                user=user,
                title=validated_data['title'],
                body=validated_data['body'],
                notification_enabled=validated_data['notification_enabled'],
                is_public=validated_data['is_public'],
            )

        for item in request.data['tags']:
            tag, created = Tag.objects.get_or_create(name=item)
            study.tags.add(tag)

        return study
