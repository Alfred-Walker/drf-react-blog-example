from rest_framework import serializers
from .models import Question
from tags.models import Tag
from comments.serializers import CommentSerializer
from users.serializers import UserSerializer


class QuestionSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='question-detail')
    user = UserSerializer(read_only=True)
    tags = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name', allow_null=True)
    comment = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = [
            'id',
            'url',
            'user',
            'title',
            'body',
            'tags',
            'comment',
            'registered_date',
        ]

    def __init__(self, *args, **kwargs):
        super(QuestionSerializer, self).__init__(*args, **kwargs)

    def create(self, validated_data):
        user = None
        request = self.context.get("request")

        if request and hasattr(request, "user"):
            user = request.user

        question = Question.objects.create(
            user=user,
            title=validated_data['title'],
            body=validated_data['body']
        )

        for item in request.data['tags']:
            tag, created = Tag.objects.get_or_create(name=item, is_public=True)
            question.tags.add(tag)

        return question

    def update(self, question, validated_data):
        question.title = validated_data.get('title', question.body)
        question.body = validated_data.get('body', question.body)

        tags_to_update = self.initial_data.get('tags')

        if tags_to_update:
            tags = []
            for tag in tags_to_update:
                tag, created = Tag.objects.get_or_create(name=tag, is_public=True)
                tags.append(tag)

        question.tags.set(tags)

        return super(QuestionSerializer, self).update(question, validated_data)


class QuestionSummarySerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='question-detail')
    user = UserSerializer(read_only=True)
    tags = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name', allow_null=True)

    class Meta:
        model = Question
        fields = [
            'id',
            'url',
            'user',
            'title',
            'tags',
            'registered_date',
        ]