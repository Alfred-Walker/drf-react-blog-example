from rest_framework import serializers
from .models import Comment
from studies.models import Study
from questions.models import Question
from .models import Comment

from users.serializers import UserNicknameSerializer


class CommentChildSerializer(serializers.ModelSerializer):
    user = UserNicknameSerializer(many=False, read_only=True)

    class Meta:
        model = Comment
        fields = [
            'user',
            'text',
            'is_public'
        ]


class CommentSerializer(serializers.ModelSerializer):
    child_comment = CommentChildSerializer(many=True, read_only=True)
    user = UserNicknameSerializer(many=False, read_only=True)

    class Meta:
        model = Comment
        fields = [
            'user',
            'text',
            'child_comment',
            'is_public',
        ]
        # fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(CommentSerializer, self).__init__(*args, **kwargs)

    def create(self, validated_data):
        def is_number(data):
            try:
                int(data)
                return True
            except ValueError:
                return False

        user = None
        parent_study = None
        parent_question = None
        parent_comment = None

        request = self.context.get("request")

        if request and hasattr(request, "user"):
            user = request.user

        if is_number(request.data['parent_study']):
            parent_study = Study.objects.get(pk=request.data['parent_study'])

            if parent_study:
                # only the author can make comment for private Studies
                if parent_study.is_public and parent_study.user != user:
                    parent_study = None

        if is_number(request.data['parent_question']):
            parent_question = Study.objects.get(pk=request.data['parent_question'])

        if is_number(request.data['parent_comment']):
            parent_comment = Comment.objects.get(pk=request.data['parent_comment'])

        comment = Comment.objects.create(
            user=user,
            parent_study=parent_study,
            parent_question=parent_question,
            parent_comment=parent_comment,
            text=validated_data['text'],
            is_public=validated_data['is_public'],
        )

        return comment
