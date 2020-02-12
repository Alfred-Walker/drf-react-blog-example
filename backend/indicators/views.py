from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from users.models import User
from studies.models import Study
from questions.models import Question
from comments.models import Comment
from tags.models import Tag

from .serializers import *


class IndicatorViewSet(viewsets.ViewSet):
    """
        A simple ViewSet to provide several indicators such as each model's row count.
    """
    serializer_class = IndicatorSerializer

    # HTTP GET /indicator/count/
    # return the number of rows for each model
    @action(detail=False)
    def count(self, request):
        all_user_count = User.objects.all().count()
        all_study_count = Study.objects.filter().count()
        all_question_count = Question.objects.all().count()
        all_comment_count = Comment.objects.all().count()
        all_tag_count = Tag.objects.all().count()

        data = {
                "all_user_count": all_user_count,
                "all_study_count": all_study_count,
                "all_question_count": all_question_count,
                "all_comment_count": all_comment_count,
                "all_tag_count": all_tag_count,
        }

        serializer = IndicatorSerializer(data, many=False)

        return Response(serializer.data)
