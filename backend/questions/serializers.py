from rest_framework import serializers
from .models import Question
from tags.models import Tag
from comments.serializers import CommentSerializer


class QuestionSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='question-detail')
    tags = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name', allow_null=True)
    comment = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = [
            'id',
            'url',
            'title',
            'body',
            'tags',
            'comment'
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

        # TODO: Fix Tag model to support both private and public
        for item in request.data['tags']:
            tag, created = Tag.objects.get_or_create(name=item, is_public=True)
            question.tags.add(tag)

        return question
