from rest_framework import serializers
from .models import Study
from tags.models import Tag
from comments.serializers import CommentSerializer
from users.serializers import UserSerializer


class StudySerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='study-detail')
    user = UserSerializer(read_only=True)
    tags = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name', allow_null=True)
    comment = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Study
        fields = [
            'id',
            'url',
            'user',
            'title',
            'body',
            'tags',
            'is_public',
            'comment',
            'registered_date',
            'last_edit_date'
        ]

    def __init__(self, *args, **kwargs):
        super(StudySerializer, self).__init__(*args, **kwargs)

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
                is_public=validated_data['is_public'],
            )
        else:
            study = Study.objects.create(
                user=user,
                title=validated_data['title'],
                body=validated_data['body'],
                is_public=validated_data['is_public'],
            )

        for item in request.data['tags']:
            tag, created = Tag.objects.get_or_create(name=item, is_public=validated_data['is_public'])
            if created:
                study.tags.add(tag)

        return study

    def update(self, study, validated_data):
        study.title = validated_data.get('title', study.body)
        study.body = validated_data.get('body', study.body)
        study.is_public = validated_data.get('is_public', study.is_public)

        tags_to_update = self.initial_data.get('tags')

        temp = []
        for tag in tags_to_update:
            tag, created = Tag.objects.get_or_create(name=tag, is_public=validated_data['is_public'])
            temp.append(tag)

        study.tags.set(temp)

        return super(StudySerializer, self).update(study, validated_data)


class StudySummarySerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='study-detail')
    user = UserSerializer(read_only=True)
    tags = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name', allow_null=True)

    class Meta:
        model = Study
        fields = [
            'id',
            'url',
            'user',
            'title',
            'tags',
            'is_public',
            'registered_date',
            'last_edit_date'
        ]