from rest_framework import serializers
from .models import Comment
from studies.models import Study
from questions.models import Question

from users.serializers import UserNicknameSerializer


class CommentChildSerializer(serializers.ModelSerializer):
    user = UserNicknameSerializer(many=False, read_only=True)

    class Meta:
        model = Comment
        fields = [
            'id',
            'user',
            'text',
            'created_date',
            'parent_comment',
            'is_active',
            'is_public'
        ]

    def to_representation(self, instance):
        ret = super(CommentChildSerializer, self).to_representation(instance)
        request = self.context.get("request")

        has_permission = False
        if instance.parent_study:
            has_permission = request.user == instance.parent_study.user \
                             or request.user == instance.user

        if instance.parent_question:
            has_permission = request.user == instance.parent_question.user \
                             or request.user == instance.user

        if instance.parent_comment:
            has_permission = request.user == instance.parent_comment.user \
                             or request.user == instance.user

        if not ret['is_public']:
            if not has_permission:
                ret['user']['nickname'] = "Private Comment"
                ret['text'] = "This comment is private."

        if not ret['is_active']:
            ret['user']['nickname'] = "Deleted Comment"
            ret['text'] = "This comment has been removed by the author."

        return ret


class CommentSerializer(serializers.ModelSerializer):
    child_comment = CommentChildSerializer(many=True, read_only=True)
    user = UserNicknameSerializer(many=False, read_only=True)

    class Meta:
        model = Comment
        fields = [
            'id',
            'user',
            'text',
            'created_date',
            'parent_study',
            'parent_question',
            'parent_comment',
            'child_comment',
            'is_active',
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

        if request.data.get('parent_study', '') and is_number(request.data['parent_study']):
            parent_study = Study.objects.get(pk=request.data['parent_study'])

            if parent_study:
                # only the author can make comment for private contents
                if parent_study.is_public and parent_study.user != user:
                    parent_study = None

        if request.data.get('parent_question', '') and is_number(request.data['parent_question']):
            parent_question = Question.objects.get(pk=request.data['parent_question'])

            if parent_question:
                # only the author can make comment for private contents
                if parent_question.is_public and parent_question.user != user:
                    parent_question = None

        if request.data.get('parent_comment', '') and is_number(request.data['parent_comment']):
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

    def to_representation(self, instance):
        ret = super(CommentSerializer, self).to_representation(instance)
        request = self.context.get("request")

        has_permission = False
        if instance.parent_study:
            has_permission = request.user == instance.parent_study.user \
                             or request.user == instance.user

        if instance.parent_question:
            has_permission = request.user == instance.parent_question.user \
                             or request.user == instance.user

        if instance.parent_comment:
            has_permission = request.user == instance.parent_comment.user \
                             or request.user == instance.user

        if not ret['is_public']:
            if not has_permission:
                ret['user']['nickname'] = "Private Comment"
                ret['text'] = "This comment is private."

        if not ret['is_active']:
            ret['user']['nickname'] = "Deleted Comment"
            ret['text'] = "This comment has been removed by the author."

        return ret
